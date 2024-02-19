import { Finding, HandleTransaction, TransactionEvent, FindingSeverity, FindingType } from "forta-agent";
import { SUPPLY_EVENT_SIGNATURE } from "./constants";

import { amountOverThreshold } from "./thresholdCache/thresholdCache";

export function provideHandleTransaction(): HandleTransaction {
  return async function handleTransaction(txEvent: TransactionEvent) {
    const findings: Finding[] = [];

    const swapTxs = txEvent.filterLog(SUPPLY_EVENT_SIGNATURE);

    const timestamp = txEvent.timestamp;

    // Iterate through transactions
    for (const tx of swapTxs) {
      const [from, dst, amount] = tx.args;

      const fromAddress = from;
      let result;
      // Call amountOverThreshold with the timestamp
      try {
        result = await amountOverThreshold(fromAddress, amount, timestamp);

        if (result == 0) {
          return findings;
        }
      } catch (e) {
        return findings;
      }

      findings.push(
        Finding.fromObject({
          name: "Compound III threshold detector",
          description: "Detected user put " + result + " over supply threshold",
          alertId: "COMP-01",
          severity: FindingSeverity.Low,
          type: FindingType.Info,
          protocol: "CompoundV3",
          metadata: {
            poolAddress: dst.toLowerCase(),
            amountOverThreshold: result.toString(),
            userAddress: fromAddress.toLowerCase(),
          },
        })
      );
    }

    return findings;
  };
}

export default {
  handleTransaction: provideHandleTransaction(),
};
