import {
  Finding,
  HandleTransaction,
  TransactionEvent,
  FindingSeverity,
  FindingType,
  getEthersProvider,
} from "forta-agent";
import { ethers } from "forta-agent";
import { SUPPLY_RATE_ABI, SUPPLY_RATE_CONTRACT_ADDRESS } from "./constants";

import { getSupplyRate, checkSupplyRate } from "./utils";

export function provideHandleTransaction(
  provider: ethers.providers.Provider,
  supplyRateABI: string,
  blockNumber: number
): HandleTransaction {
  return async function handleTransaction(txEvent: TransactionEvent) {
    const findings: Finding[] = [];

    if (txEvent.to != SUPPLY_RATE_CONTRACT_ADDRESS.toLowerCase()) {
      return findings;
    }
    const swapTxs = txEvent.filterFunction(supplyRateABI);

    // Iterate through transactions
    for (const tx of swapTxs) {
      try {
        const [utilization] = tx.args;

        const supplyRateInfo = await getSupplyRate(provider, supplyRateABI, blockNumber, utilization);
        const supplyNotification: string = await checkSupplyRate(supplyRateInfo);
        let supplyString = "";
        let action = "";
        //if statement here to check if utilization is over or under 5% ADP
        if (supplyNotification == "under one percent") {
          supplyString = "low";
          action = "withdraw";
        } else if (supplyNotification == "over five percent") {
          supplyString = "high";
          action = "invest";
        } else {
          return findings;
        }
        findings.push(
          Finding.fromObject({
            name: "Compound III Supply rate notifier",
            description:
              "Utilzation is " + supplyString + " at the rate of " + supplyRateInfo + " user should " + action,
            alertId: "COMPOUND-SUPPLY-RATE-123",
            severity: FindingSeverity.Info,
            type: FindingType.Info,
            protocol: "CompoundV3",
            metadata: {
              supplyRateInfo: supplyRateInfo.toString(),
              supplyNotification: supplyNotification,
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
  handleTransaction: provideHandleTransaction(getEthersProvider(), SUPPLY_RATE_ABI, 0),
};
