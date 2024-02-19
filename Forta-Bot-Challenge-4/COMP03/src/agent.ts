import {
  Finding,
  HandleTransaction,
  TransactionEvent,
  FindingSeverity,
  FindingType,
  getEthersProvider,
  BlockEvent,
  HandleBlock,
} from "forta-agent";
import { ethers } from "forta-agent";
import { SUPPLY_RATE_ABI, SUPPLY_RATE_CONTRACT_ADDRESS } from "./constants";

import { getSupplyRate, checkSupplyRate } from "./utils";

export function provideHandleBlock(
  provider: ethers.providers.Provider,
  supplyRateABI: string,
  blockNumber: number,
  utilization: number
): HandleBlock {
  return async function handleBlock(block: BlockEvent): Promise<Finding[]> {
    const findings: Finding[] = [];

    try {
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
          description: "Utilzation is " + supplyString + " at the rate of " + supplyRateInfo + " user should " + action,
          alertId: "COMP-03",
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
    return findings;
  };
}

export default {
  handleTransaction: provideHandleBlock(getEthersProvider(), SUPPLY_RATE_ABI, 0, 0),
};
