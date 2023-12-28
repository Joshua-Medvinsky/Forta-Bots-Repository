import {
  Finding,
  HandleBlock,
  Initialize,
  FindingSeverity,
  FindingType,
  getEthersProvider,
  BlockEvent,
} from "forta-agent";
import { ethers } from "forta-agent";
import { REWARDS_ABI, REWARDS_CONTRACT_ADDRESS } from "./constants";
import { getRewardOwed } from "./utils";

export function provideHandleBlock(
  provider: ethers.providers.Provider,
  rewardsABI: string,
  blockNumber: number,
  accountAddress: string,
  cometAddress: string
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
      if (cometAddress != REWARDS_CONTRACT_ADDRESS) return findings;

      const rewardInfo = await getRewardOwed(accountAddress, provider, rewardsABI, blockNumber);

      findings.push(
        Finding.fromObject({
          name: "Compound III rewards notifier",
          description: "User has " + rewardInfo + " in rewards for token: USDC",
          alertId: "COMPOUND-REWARDS-123",
          severity: FindingSeverity.Info,
          type: FindingType.Info,
          protocol: "CompoundV3",
          metadata: {
            rewardAmount: rewardInfo,
          },
        })
      );
    } catch (e) {
      return findings;
    }
    return findings;
  };
}

export default {
  handleTransaction: provideHandleBlock(getEthersProvider(), REWARDS_ABI, 0, "", REWARDS_CONTRACT_ADDRESS),
};
