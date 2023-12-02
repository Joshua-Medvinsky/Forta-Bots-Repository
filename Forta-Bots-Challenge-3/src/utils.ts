import { ethers, Contract, BigNumber } from "ethers";
import { Finding, FindingSeverity, FindingType } from "forta-agent";
import {
  L2_FUNCTION_SIGNATURE,
  L2_TOKEN_ADDRESS_MAKER_DAO,
} from "./constants";

export const getL1Finding = async (
  daiContract: Contract,
  blockNumber: number,
  escrowAddressArbitrum: string,
  escrowAddressOptimism: string,
) => {
  const arbitrumBalance: BigNumber = await daiContract.balanceOf(
    escrowAddressArbitrum,
    {
      blockTag: blockNumber,
    },
  );
  const optimismBalance: BigNumber = await daiContract.balanceOf(
    escrowAddressOptimism,
    {
      blockTag: blockNumber,
    },
  );

  return Finding.fromObject({
    name: `Combined supply of optimism and Arbitrum MakerDao escrows on layer 1`,
    description: `Escrow balances: Arbitrum: ${arbitrumBalance} Optimism: ${optimismBalance}`,
    alertId: "new block check escrows on layer 1",
    severity: FindingSeverity.Info,
    type: FindingType.Info,
    protocol: "Ethereum",
    metadata: {
      escrowBalanceOptimism: `${optimismBalance}`,
      escrowBalanceArbitrum: `${arbitrumBalance}`,
    },
  });
};

export const checkBlock = async (
  provider: ethers.providers.Provider,
  blockNumber: number,
  chainId: number,
  alert: any,
): Promise<Array<Finding>> => {
  const l2Contract = new Contract(
    L2_TOKEN_ADDRESS_MAKER_DAO,
    L2_FUNCTION_SIGNATURE,
    provider,
  );
  const l2Balance = await l2Contract.totalSupply({ blockTag: blockNumber });
  if (alert.length == 0) {
    return [];
  }
  //assigns balance and network based off of chainID
  const l2Network = chainId === 42161 ? "Arbitrum" : "Optimism";
  const l1Balance =
    chainId === 42161
      ? alert.metadata.escrowBalanceArbitrum
      : alert.metadata.escrowBalanceOptimism;

  if (l2Balance.gt(l1Balance)) {
    return [
      Finding.fromObject({
        name: `${l2Network} layer 2 dai supply is more then the layer 1 escrow dai balance`,
        description: `L1Escrow Balance: ${l1Balance}, ${l2Network} L2Supply Balance: ${l2Balance}`,
        alertId: `L1 ${l2Network} supply issue`,
        severity: FindingSeverity.High,
        type: FindingType.Degraded,
        protocol: `${l2Network}`,
        metadata: {
          L1Bal: `${l1Balance}`,
          L2Bal: `${l2Balance}`,
        },
      }),
    ];
  }

  return [];
};

//get rid of this function below?? to simple can be done manually
export const createContract = (
  contractAddress: string,
  provider: ethers.providers.Provider,
  contractABI: string[],
) => {
  return new Contract(contractAddress, contractABI, provider);
};
