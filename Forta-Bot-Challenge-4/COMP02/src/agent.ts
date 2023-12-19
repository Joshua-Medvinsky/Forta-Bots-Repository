import {
  Finding,
  HandleTransaction,
  TransactionEvent,
  FindingSeverity,
  FindingType,
  getEthersProvider,
} from "forta-agent";
import { ethers } from "forta-agent";
import { REWARDS_ABI, REWARDS_CONTRACT_ADDRESS, RewardOwed } from "./constants";

import { getRewardOwed } from "./utils";

export function provideHandleTransaction(
  provider: ethers.providers.Provider,
  rewardsABI: string,
  blockNumber: number
): HandleTransaction {
  return async function handleTransaction(txEvent: TransactionEvent) {
    const findings: Finding[] = [];

    if (txEvent.to != REWARDS_CONTRACT_ADDRESS.toLowerCase()) {
      return findings;
    }
    const swapTxs = txEvent.filterFunction(rewardsABI);

    // Iterate through transactions
    for (const tx of swapTxs) {
      try {
        const [comet, account] = tx.args;

        const rewardInfo: RewardOwed = await getRewardOwed(account, comet, provider, rewardsABI, blockNumber);

        findings.push(
          Finding.fromObject({
            name: "Compound III rewards notifier",
            description: "User has " + rewardInfo.owed + " in rewards for token: " + rewardInfo.address,
            alertId: "COMPOUND-REWARDS-123",
            severity: FindingSeverity.Info,
            type: FindingType.Info,
            protocol: "CompoundV3",
            metadata: {
              rewardToken: rewardInfo.address,
              rewardAmount: rewardInfo.owed,
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
  handleTransaction: provideHandleTransaction(getEthersProvider(), REWARDS_ABI, 0),
};
