import { Finding, HandleTransaction, TransactionEvent, FindingSeverity, FindingType } from "forta-agent";
import { FORTA_BOT_REGISTRY, BOT_DEPLOYER_ADDRESS, NEW_AGENT_FUNCTION_SIGNATURE } from "./constants";

export function provideHandleTransaction(
  fortaRegistryAddress: string,
  nethermindDeployerAddress: string,
  functionABI: string
): HandleTransaction {
  return async function handleTransaction(txEvent: TransactionEvent) {
    const findings: Finding[] = [];
    //check from address with deployer address
    if (txEvent.from != nethermindDeployerAddress.toLowerCase()) {
      return findings;
    }
    //check if the function ABI passed in is different from the forta bot ABI (External check)
    if (functionABI != NEW_AGENT_FUNCTION_SIGNATURE) {
      return findings;
    }
    // Store/filter bot transactions
    const newAgentTxs = txEvent.filterFunction(functionABI, fortaRegistryAddress);

    // Iterate through transactions
    newAgentTxs.forEach((tx) => {
      const { agentId, owner, chainIds, metadata } = tx.args;
      //Create a Finding object and push it into the findings array
      findings.push(
        Finding.fromObject({
          name: "Nethermind Bot Deployment Detector",
          description: "Detects Bots Deployed by Nethermind",
          alertId: "FORTA-123",
          severity: FindingSeverity.Info,
          type: FindingType.Info,
          metadata: {
            agentId: agentId.toString(),
            owner,
            chainIds: chainIds.toString(),
            metadata,
          },
        })
      );
    });

    return findings;
  };
}

export default {
  handleTransaction: provideHandleTransaction(FORTA_BOT_REGISTRY, BOT_DEPLOYER_ADDRESS, NEW_AGENT_FUNCTION_SIGNATURE),
};
