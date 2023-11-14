import {
  Finding,
  HandleTransaction,
  TransactionEvent,
  FindingSeverity, 
  FindingType,    
} from "forta-agent";
import { FORTA_BOT_REGISTRY, BOT_DEPLOYER_ADDRESS, NEW_AGENT_FUNCTION_SIGNATURE } from "./constants";


export default function provideHandleTransaction(
  proxyAddress: string,
  deployerAddress: string,
  functionABI: string
): HandleTransaction {
  return async (txEvent: TransactionEvent):Promise<Finding[]>  => {
    const findings: Finding[] = [];
    //check from address with deployer address
    if (txEvent.from != deployerAddress.toLowerCase()) {
      return findings;
    }

    // Store/filter bot transactions
    const botTxs = txEvent.filterFunction(functionABI, proxyAddress);

    // Iterate through transactions
    botTxs.forEach((tx) => {
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
            agentId:agentId.toString(),  
            owner,
            chainIds:chainIds.toString(),
            metadata: metadata,
          },
        })
      );
    });

    return findings;
  };
}

