import {
  Finding,
  FindingSeverity,
  FindingType,
  createTransactionEvent,
  HandleTransaction,
  TransactionEvent,

} from "forta-agent";
import { TestTransactionEvent } from "forta-agent-tools/lib/test";
import { createAddress } from "forta-agent-tools";
import { Interface } from "@ethersproject/abi";
import { FORTA_BOT_REGISTRY, BOT_DEPLOYER_ADDRESS, NEW_AGENT_FUNCTION_SIGNATURE, TEST_AGENT_FUNCTION_SIGNATURE } from "./constants";
import { BigNumber } from "ethers";
import { provideHandleTransaction } from "./agent";
//mock txs data:

const mockTxEventOne = {
  agentId: "123456",
  owner: BOT_DEPLOYER_ADDRESS,
  chainIds: ["56"],
  metadata: "Dummy info 1",
}

const mockTxEventTwo = {
  agentId: "654321",
  owner: BOT_DEPLOYER_ADDRESS,
  chainIds: ["56"],
  metadata: "Dummy info 2",
}


describe("bot deployment agent", () => {
  let handleTransaction: HandleTransaction;
  let mockTxEvent = createTransactionEvent({} as any);
  let findings = [];
  beforeAll(() => {
    handleTransaction = provideHandleTransaction(FORTA_BOT_REGISTRY, BOT_DEPLOYER_ADDRESS, NEW_AGENT_FUNCTION_SIGNATURE);
  });

  const proxyInterface = new Interface([NEW_AGENT_FUNCTION_SIGNATURE]);

  describe("handleTransaction", () => {
    it("returns empty findings if there are no bot deployments", async () => {
      mockTxEvent = new TestTransactionEvent();
      findings = await handleTransaction(mockTxEvent);
      expect(findings).toStrictEqual([]);
    });
    it("returns empty findings if the deployer is NOT Nethermind", async () => {
      const fromAddress = createAddress("0xad");
      mockTxEvent = new TestTransactionEvent()
        .setFrom(fromAddress) //set the from value to a dummy value thats not the nethermind contract address
        .setTo(FORTA_BOT_REGISTRY)
        .addTraces({
          function: proxyInterface.getFunction("newAgent"),
          to: FORTA_BOT_REGISTRY,
          from: fromAddress,
          arguments: [
            mockTxEventOne.agentId,
            mockTxEventOne.owner,
            mockTxEventOne.metadata,
            [BigNumber.from(mockTxEventOne.chainIds[0])],
          ],
        });

      findings = await handleTransaction(mockTxEvent);
      expect(findings).toStrictEqual([]);
    })
    it("returns a finding if there is a bot deployment", async () => {
      mockTxEvent = new TestTransactionEvent()
        .setFrom(BOT_DEPLOYER_ADDRESS)
        .setTo(FORTA_BOT_REGISTRY)
        .addTraces({
          function: proxyInterface.getFunction("newAgent"),
          to: FORTA_BOT_REGISTRY,
          from: BOT_DEPLOYER_ADDRESS,
          arguments: [
            mockTxEventOne.agentId,
            mockTxEventOne.owner,
            mockTxEventOne.metadata,
            [BigNumber.from(mockTxEventOne.chainIds[0])],
          ],
        });

      findings = await handleTransaction(mockTxEvent);

      //make sure findings is equal to the mock transaction we created
      expect(findings).toStrictEqual([
        expect.objectContaining({
          name: "Nethermind Bot Deployment Detector",
          description: "Detects Bots Deployed by Nethermind",
          alertId: "FORTA-123",
          severity: FindingSeverity.Info,
          type: FindingType.Info,
          metadata: {
            agentId: mockTxEventOne.agentId.toString(),
            owner: mockTxEventOne.owner,
            metadata: mockTxEventOne.metadata,
            chainIds: mockTxEventOne.chainIds[0],
          },
        }),
      ]);
    });
    it("returns findings if there are multiple bot deployments", async () => {
      mockTxEvent = new TestTransactionEvent()
        .setFrom(BOT_DEPLOYER_ADDRESS)
        .setTo(FORTA_BOT_REGISTRY)
        .addTraces({
          function: proxyInterface.getFunction("newAgent"),
          to: FORTA_BOT_REGISTRY,
          from: BOT_DEPLOYER_ADDRESS,
          arguments: [
            mockTxEventOne.agentId,
            mockTxEventOne.owner,
            mockTxEventOne.metadata,
            [BigNumber.from(mockTxEventOne.chainIds[0])],
          ],
        })
        .addTraces({
          function: proxyInterface.getFunction("newAgent"),
          to: FORTA_BOT_REGISTRY,
          from: BOT_DEPLOYER_ADDRESS,
          arguments: [
            mockTxEventTwo.agentId,
            mockTxEventTwo.owner,
            mockTxEventTwo.metadata,
            [BigNumber.from(mockTxEventTwo.chainIds[0])],
          ],
        })
        ;

      findings = await handleTransaction(mockTxEvent);

      //make sure findings is equal to the mock transactions we created
      expect(findings).toStrictEqual([
        expect.objectContaining({
          name: "Nethermind Bot Deployment Detector",
          description: "Detects Bots Deployed by Nethermind",
          alertId: "FORTA-123",
          severity: FindingSeverity.Info,
          type: FindingType.Info,
          metadata: {
            agentId: mockTxEventOne.agentId.toString(),
            owner: mockTxEventOne.owner,
            metadata: mockTxEventOne.metadata,
            chainIds: mockTxEventOne.chainIds[0],
          },
        }),
        expect.objectContaining({
          name: "Nethermind Bot Deployment Detector",
          description: "Detects Bots Deployed by Nethermind",
          alertId: "FORTA-123",
          severity: FindingSeverity.Info,
          type: FindingType.Info,
          metadata: {
            agentId: mockTxEventTwo.agentId.toString(),
            owner: mockTxEventTwo.owner,
            metadata: mockTxEventTwo.metadata,
            chainIds: mockTxEventTwo.chainIds[0],
          },
        })
        ,
      ]);
    });
    it("returns empty findings if there is a bot deployment with the wrong function abi", async () => {
      const newProxyInterface = new Interface([TEST_AGENT_FUNCTION_SIGNATURE]);

      mockTxEvent = new TestTransactionEvent()
        .setFrom(BOT_DEPLOYER_ADDRESS)
        .setTo(FORTA_BOT_REGISTRY)
        .addTraces({
          function: newProxyInterface.getFunction("fooAgent"),
          to: FORTA_BOT_REGISTRY,
          from: BOT_DEPLOYER_ADDRESS,
          arguments: [
            mockTxEventOne.agentId,
            mockTxEventOne.owner,
            mockTxEventOne.metadata,
            [BigNumber.from(mockTxEventOne.chainIds[0])],
          ],
        });

      findings = await handleTransaction(mockTxEvent);

      //make sure findings is equal to an empty array
      expect(findings).toStrictEqual([]);
    });
    it("returns empty findings if there is a bot deployment with a call to newAgent function NOT in the fortaContract", async () => {
      const newProxyInterface = new Interface([TEST_AGENT_FUNCTION_SIGNATURE]);

      mockTxEvent = new TestTransactionEvent()
        .setFrom(BOT_DEPLOYER_ADDRESS)
        .setTo(FORTA_BOT_REGISTRY)
        .addTraces({
          function: newProxyInterface.getFunction("fooAgent"),
          to: FORTA_BOT_REGISTRY,
          from: BOT_DEPLOYER_ADDRESS,
          arguments: [
            mockTxEventOne.agentId,
            mockTxEventOne.owner,
            mockTxEventOne.metadata,
            [BigNumber.from(mockTxEventOne.chainIds[0])],
          ],
        });

      findings = await handleTransaction(mockTxEvent);

      //make sure findings is equal to an empty array
      expect(findings).toStrictEqual([]);
    });
  });


});
