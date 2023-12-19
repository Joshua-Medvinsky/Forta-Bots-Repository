import { Finding, FindingSeverity, FindingType, HandleTransaction } from "forta-agent";
//import { POOL_INIT_CODE_HASH, UNISWAP_POOL_FUNCTION_SIGNATURE, SWAP_FUNCTION_SIGNATURE } from "./constants";
import { TestTransactionEvent, MockEthersProvider } from "forta-agent-tools/lib/test";
import { createAddress } from "forta-agent-tools";
import { ethers } from "ethers";
import { provideHandleTransaction } from "./agent";
import { Provider } from "@ethersproject/abstract-provider";
import { SUPPLY_RATE_ABI, SUPPLY_RATE_CONTRACT_ADDRESS, WRONG_SUPPLY_RATE_ABI } from "./constants";

describe("Compound 3 bot tests", () => {
  let handleTransaction: HandleTransaction;
  let proxyInterface: ethers.utils.Interface;
  const userDummyAddress = createAddress("0xabc");
  const wrongCometAddress = createAddress("0x123");
  const cometAddress = SUPPLY_RATE_CONTRACT_ADDRESS;
  let mockProvider = new MockEthersProvider();
  let startingBlockNumber = 0;
  let action = "";
  let supplyRateInfo = "";
  let lowUtilizationValue = 100;
  let supplyAPR = "300000000";
  let supplyString = "";

  let findings = [];
  let mockTxEvent = new TestTransactionEvent();
  let provider: any;
  beforeEach(() => {
    mockProvider = new MockEthersProvider();
    provider = mockProvider as unknown as Provider;
    handleTransaction = provideHandleTransaction(provider, SUPPLY_RATE_ABI, startingBlockNumber);
    proxyInterface = new ethers.utils.Interface([SUPPLY_RATE_ABI]);
    mockTxEvent = new TestTransactionEvent();
  });

  it("returns empty findings if there are no supply rate events", async () => {
    findings = await handleTransaction(mockTxEvent);
    expect(findings).toStrictEqual([]);
  });
  it("returns a empty findings when the transaction is not a supply rate", async () => {
    proxyInterface = new ethers.utils.Interface([WRONG_SUPPLY_RATE_ABI]);
    mockTxEvent.setBlock(0);
    mockTxEvent = new TestTransactionEvent()
      .setFrom(userDummyAddress)
      .setTo(cometAddress)
      .addTraces({
        function: proxyInterface.getFunction("fooSupplyRate"),
        to: cometAddress,
        from: userDummyAddress,
        arguments: [lowUtilizationValue],
        output: [supplyAPR],
      });
    mockProvider.setNetwork(1);
    mockProvider.addCallTo(cometAddress, 0, proxyInterface, "fooSupplyRate", {
      inputs: [lowUtilizationValue],
      outputs: [supplyAPR],
    });
    mockProvider.setLatestBlock(0);
    findings = await handleTransaction(mockTxEvent);
    expect(findings).toStrictEqual([]);
  });

  it("returns empty findings when address is incorrect", async () => {
    mockTxEvent.setBlock(0);
    mockTxEvent = new TestTransactionEvent()
      .setFrom(userDummyAddress)
      .setTo(wrongCometAddress)
      .addTraces({
        function: proxyInterface.getFunction("getSupplyRate"),
        to: wrongCometAddress,
        from: userDummyAddress,
        arguments: [lowUtilizationValue],
        output: [supplyAPR],
      });
    mockProvider.setNetwork(1);
    mockProvider.addCallTo(cometAddress, 0, proxyInterface, "getSupplyRate", {
      inputs: [lowUtilizationValue],
      outputs: [supplyAPR],
    });
    mockProvider.setLatestBlock(0);
    findings = await handleTransaction(mockTxEvent);

    expect(findings).toStrictEqual([]);
  });

  it("returns findings when supply rate is low", async () => {
    supplyString = "low";
    supplyRateInfo = supplyAPR;
    action = "withdraw";
    mockTxEvent.setBlock(0);
    mockTxEvent = new TestTransactionEvent()
      .setFrom(userDummyAddress)
      .setTo(cometAddress)
      .addTraces({
        function: proxyInterface.getFunction("getSupplyRate"),
        to: cometAddress,
        from: userDummyAddress,
        arguments: [lowUtilizationValue],
        output: [supplyAPR],
      });
    mockProvider.setNetwork(1);
    mockProvider.addCallTo(cometAddress, 0, proxyInterface, "getSupplyRate", {
      inputs: [lowUtilizationValue],
      outputs: [supplyAPR],
    });
    mockProvider.setLatestBlock(0);
    findings = await handleTransaction(mockTxEvent);

    expect(findings).toStrictEqual([
      Finding.fromObject({
        name: "Compound III Supply rate notifier",
        description: "Utilzation is " + supplyString + " at the rate of " + supplyAPR + " user should " + action,
        alertId: "COMPOUND-SUPPLY-RATE-123",
        severity: FindingSeverity.Info,
        type: FindingType.Info,
        protocol: "CompoundV3",
        metadata: {
          supplyRateInfo: supplyRateInfo.toString(),
          supplyNotification: "under one percent",
        },
      }),
    ]);
  });

  it("returns findings when supply rate is high", async () => {
    let highUtilizationValue = 5600000000;
    supplyAPR = "1685500000";
    supplyString = "high";
    supplyRateInfo = supplyAPR;
    action = "invest";
    mockTxEvent.setBlock(0);
    mockTxEvent = new TestTransactionEvent()
      .setFrom(userDummyAddress)
      .setTo(cometAddress)
      .addTraces({
        function: proxyInterface.getFunction("getSupplyRate"),
        to: cometAddress,
        from: userDummyAddress,
        arguments: [highUtilizationValue],
        output: [supplyAPR],
      });
    mockProvider.setNetwork(1);
    mockProvider.addCallTo(cometAddress, 0, proxyInterface, "getSupplyRate", {
      inputs: [highUtilizationValue],
      outputs: [supplyAPR],
    });
    mockProvider.setLatestBlock(0);
    findings = await handleTransaction(mockTxEvent);

    expect(findings).toStrictEqual([
      Finding.fromObject({
        name: "Compound III Supply rate notifier",
        description: "Utilzation is " + supplyString + " at the rate of " + supplyAPR + " user should " + action,
        alertId: "COMPOUND-SUPPLY-RATE-123",
        severity: FindingSeverity.Info,
        type: FindingType.Info,
        protocol: "CompoundV3",
        metadata: {
          supplyRateInfo: supplyRateInfo.toString(),
          supplyNotification: "over five percent",
        },
      }),
    ]);
  });

  it("returns findings when supply rate is within range", async () => {
    let utilizationValue = 2800000000;
    supplyAPR = "792750000";
    mockTxEvent.setBlock(0);
    mockTxEvent = new TestTransactionEvent()
      .setFrom(userDummyAddress)
      .setTo(cometAddress)
      .addTraces({
        function: proxyInterface.getFunction("getSupplyRate"),
        to: cometAddress,
        from: userDummyAddress,
        arguments: [utilizationValue],
        output: [supplyAPR],
      });
    mockProvider.setNetwork(1);
    mockProvider.addCallTo(cometAddress, 0, proxyInterface, "getSupplyRate", {
      inputs: [utilizationValue],
      outputs: [supplyAPR],
    });
    mockProvider.setLatestBlock(0);
    findings = await handleTransaction(mockTxEvent);

    expect(findings).toStrictEqual([]);
  });
});
