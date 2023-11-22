import {
  Finding,
  HandleTransaction,
  TransactionEvent,
  FindingSeverity,
  FindingType,
  getEthersProvider,
} from "forta-agent";
import {
  UNISWAP_FACTORY_ADDRESS,
  POOL_INIT_CODE_HASH,
  UNISWAP_POOL_FUNCTION_SIGNATURE,
  SWAP_FUNCTION_SIGNATURE,
} from "./constants";
import { providers, ethers } from "ethers";
import { getPoolValues, isUniswapAddress, computeAddress } from "./utils";

export function provideHandleTransaction(
  provider: ethers.providers.Provider,
  uniswapPoolABI: string[],
  swapABI: string,
  factoryAddress: string
): HandleTransaction {
  return async function handleTransaction(txEvent: TransactionEvent) {
    const findings: Finding[] = [];

    // Store/filter bot transactions
    const swapTxs = txEvent.filterLog(SWAP_FUNCTION_SIGNATURE);

    // Iterate through transactions
    for (const tx of swapTxs) {
      try {
        const [sender, recipient, amount0, amount1, liquidity] = tx.args;

        const poolAddress = tx.address;

        const { token0, token1, fee } = await getPoolValues(poolAddress, provider, uniswapPoolABI, txEvent.blockNumber);

        const uniswapAddressBool = await isUniswapAddress(
          poolAddress,
          provider,
          factoryAddress,
          txEvent.blockNumber,
          token0,
          token1,
          fee
        );

        // Create a Finding object and push it into the findings array
        if (uniswapAddressBool == false) {
          return findings;
        }
        findings.push(
          Finding.fromObject({
            name: "Uniswap V3 Swap Event Detector",
            description: "Detects new Swap events from Uniswap V3 pool",
            alertId: "UNISWAP-123",
            severity: FindingSeverity.Info,
            type: FindingType.Info,
            protocol: "UniswapV3",
            metadata: {
              poolAddress: poolAddress.toLowerCase(),
              sender: sender,
              recipient: recipient,
              amount0: amount0.toString(),
              amount1: amount1.toString(),
              liquidity: liquidity.toString(),
            },
          })
        );
      } catch (e) {
        return findings;
      }
    }

    return findings;
  };
}

export default {
  handleTransaction: provideHandleTransaction(
    getEthersProvider(),
    UNISWAP_POOL_FUNCTION_SIGNATURE,
    SWAP_FUNCTION_SIGNATURE,
    UNISWAP_FACTORY_ADDRESS
  ),
};
