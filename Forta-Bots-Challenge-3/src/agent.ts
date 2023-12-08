import {
  Finding,
  HandleBlock,
  getEthersProvider,
  BlockEvent,
  getAlerts,
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
): HandleBlock {
  return async function handleBlock(block: BlockEvent): Promise<Finding[]> {
    const findings: Finding[] = [];
    const { chainId } = await provider.getNetwork();

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
          alertId: "L1 escrow supply alert",
          chainId: chainId,
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
  handleBlock: provideHandleBlock(getEthersProvider()),
};
