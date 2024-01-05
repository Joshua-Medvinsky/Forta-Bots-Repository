import {
  Finding,
  HandleBlock,
  getEthersProvider,
  BlockEvent,
  Initialize,
} from "forta-agent";
import {
  DAI_ADDRESS,
  L1_ESCROW_ARBITRUM,
  L1_ESCROW_FUNCTION_SIGNATURE,
  L1_ESCROW_OPTIMISM,
  BOT_ID,
} from "./constants";
import { ethers, Contract } from "ethers";
import { getL1Finding, checkBlock } from "./utils";

export function provideHandleBlock(
  provider: ethers.providers.Provider,
  getAlerts: any,
): HandleBlock {
  let chainId: number;

  const initialize: Initialize = async () => {
    const networkInfo = await provider.getNetwork();
    chainId = networkInfo.chainId;
  };

  return async function handleBlock(block: BlockEvent): Promise<Finding[]> {
    const findings: Finding[] = [];
    await initialize();

    try {
      if (chainId == 1) {
        const daiContract = new Contract(
          DAI_ADDRESS,
          L1_ESCROW_FUNCTION_SIGNATURE,
          provider,
        );
        findings.push(
          await getL1Finding(
            daiContract,
            block.blockNumber,
            L1_ESCROW_ARBITRUM,
            L1_ESCROW_OPTIMISM,
          ),
        );
      } else {
        //Listen to alerts
        const alerts = await getAlerts({
          botIds: [BOT_ID],
          alertId: "L1-BLOCK-CHECK-ESCROWS",
          chainId: 1,
        });

        const blockFindings = await checkBlock(
          provider,
          block.blockNumber,
          chainId,
          alerts,
        );

        if (blockFindings.length > 0) {
          findings.push(...blockFindings);
        }
      }
    } catch (e) {
      return findings;
    }

    return findings;
  };
}

export default {
  handleBlock: provideHandleBlock(getEthersProvider(), () => alert),
};
