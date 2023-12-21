import { Finding, HandleTransaction, TransactionEvent, FindingSeverity, FindingType } from "forta-agent";
import { SUPPLY_EVENT_SIGNATURE } from "./constants";

import { isOverThreshold } from "./utils";

export function provideHandleTransaction(userAddress: String): HandleTransaction {
  return async function handleTransaction(txEvent: TransactionEvent) {
    const findings: Finding[] = [];

    const swapTxs = txEvent.filterLog(SUPPLY_EVENT_SIGNATURE);

    const timestamp = txEvent.timestamp;

    // Iterate through transactions
    for (const tx of swapTxs) {
      try {
        const [from, dst, amount] = tx.args;
        const poolAddress = tx.address; //to-do remove pool address
        // Call isOverThreshold with the timestamp
        const result = await isOverThreshold(poolAddress, amount, timestamp);

        if (result == 0) {
          return findings;
        }
        findings.push(
          Finding.fromObject({
            name: "Compound III threshold detector",
            description: "Detected user put " + result + " over supply threshold",
            alertId: "COMPOUND-THRESH-123",
            severity: FindingSeverity.Low,
            type: FindingType.Info,
            protocol: "CompoundV3",
            metadata: {
              poolAddress: poolAddress.toLowerCase(),
              amountOverThreshold: result.toString(),
              userAddress: userAddress.toLowerCase(),
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
  handleTransaction: provideHandleTransaction(""),
};
