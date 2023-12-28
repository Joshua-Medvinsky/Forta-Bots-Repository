import {
  BlockEvent,
  Finding,
  FindingSeverity,
  FindingType,
  HandleBlock,
  HandleTransaction,
  createBlockEvent,
  Block,
} from "forta-agent";
import { TestTransactionEvent, MockEthersProvider } from "forta-agent-tools/lib/test";
import { createAddress } from "forta-agent-tools";
import { ethers } from "ethers";
import { provideHandleBlock } from "./agent";
import { Provider } from "@ethersproject/abstract-provider";
import { SUPPLY_RATE_ABI, SUPPLY_RATE_CONTRACT_ADDRESS, WRONG_SUPPLY_RATE_ABI } from "./constants";

describe("Compound 3 bot tests", () => {
  let proxyInterface: ethers.utils.Interface;
  const wrongCometAddress = createAddress("0x123");
  const cometAddress = SUPPLY_RATE_CONTRACT_ADDRESS;
  let mockProvider = new MockEthersProvider();
  let startingBlockNumber = 0;
  let action = "";
  let supplyRateInfo = "";
  let lowUtilizationValue = 100;
  let supplyAPR = "300000000";
  let supplyString = "";
  let baseUtilizationValue = 1000;

  let findings = [];

  let provider: any;
  let handleBlock: HandleBlock;
  beforeEach(() => {
    mockProvider = new MockEthersProvider();
    provider = mockProvider as unknown as Provider;
    proxyInterface = new ethers.utils.Interface([SUPPLY_RATE_ABI]);
  });

  it("returns empty findings if there are no block events", async () => {
    handleBlock = provideHandleBlock(provider, SUPPLY_RATE_ABI, startingBlockNumber, baseUtilizationValue);

    const blockEvent = createBlockEvent({
      block: { hash: createAddress("0x123"), number: startingBlockNumber } as Block,
    });
    mockProvider.setNetwork(1);

    findings = await handleBlock(blockEvent);

    expect(findings).toStrictEqual([]);
  });
  it("returns a empty findings when the block event is using the wrong abi", async () => {
    handleBlock = provideHandleBlock(provider, SUPPLY_RATE_ABI, startingBlockNumber, baseUtilizationValue);
    proxyInterface = new ethers.utils.Interface([WRONG_SUPPLY_RATE_ABI]);
    const blockEvent = createBlockEvent({
      block: { hash: createAddress("0x123"), number: startingBlockNumber } as Block,
    });
    mockProvider.setNetwork(1);
    mockProvider.addCallTo(cometAddress, 0, proxyInterface, "fooSupplyRate", {
      inputs: [lowUtilizationValue],
      outputs: [supplyAPR],
    });
    mockProvider.setLatestBlock(0);
    findings = await handleBlock(blockEvent);
    expect(findings).toStrictEqual([]);
  });

  it("returns empty findings when comet address is incorrect", async () => {
    handleBlock = provideHandleBlock(provider, SUPPLY_RATE_ABI, startingBlockNumber, baseUtilizationValue);
    const blockEvent = createBlockEvent({
      block: { hash: createAddress("0x123"), number: startingBlockNumber } as Block,
    });

    mockProvider.setNetwork(1);
    mockProvider.addCallTo(wrongCometAddress, 0, proxyInterface, "getSupplyRate", {
      inputs: [baseUtilizationValue],
      outputs: [supplyAPR],
    });
    mockProvider.setLatestBlock(0);
    findings = await handleBlock(blockEvent);

    expect(findings).toStrictEqual([]);
  });

  it("returns findings when supply rate is low", async () => {
    supplyString = "low";
    supplyRateInfo = supplyAPR;
    action = "withdraw";
    handleBlock = provideHandleBlock(provider, SUPPLY_RATE_ABI, startingBlockNumber, lowUtilizationValue);
    const blockEvent = createBlockEvent({
      block: { hash: createAddress("0x123"), number: startingBlockNumber } as Block,
    });
    mockProvider.setNetwork(1);
    mockProvider.addCallTo(cometAddress, startingBlockNumber, proxyInterface, "getSupplyRate", {
      inputs: [lowUtilizationValue],
      outputs: [supplyAPR],
    });

    findings = await handleBlock(blockEvent);

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
    handleBlock = provideHandleBlock(provider, SUPPLY_RATE_ABI, startingBlockNumber, highUtilizationValue);
    const blockEvent = createBlockEvent({
      block: { hash: createAddress("0x123"), number: startingBlockNumber } as Block,
    });
    mockProvider.setNetwork(1);
    mockProvider.addCallTo(cometAddress, startingBlockNumber, proxyInterface, "getSupplyRate", {
      inputs: [highUtilizationValue],
      outputs: [supplyAPR],
    });

    findings = await handleBlock(blockEvent);

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

    handleBlock = provideHandleBlock(provider, SUPPLY_RATE_ABI, startingBlockNumber, utilizationValue);
    const blockEvent = createBlockEvent({
      block: { hash: createAddress("0x123"), number: startingBlockNumber } as Block,
    });
    mockProvider.setNetwork(1);
    mockProvider.addCallTo(cometAddress, startingBlockNumber, proxyInterface, "getSupplyRate", {
      inputs: [utilizationValue],
      outputs: [supplyAPR],
    });

    mockProvider.setNetwork(1);
    mockProvider.addCallTo(cometAddress, 0, proxyInterface, "getSupplyRate", {
      inputs: [utilizationValue],
      outputs: [supplyAPR],
    });
    mockProvider.setLatestBlock(0);
    findings = await handleBlock(blockEvent);
    expect(findings).toStrictEqual([]);
  });

  it("check every 100 blocks", async () => {
    let utilizationValue = 2800000000;
    supplyAPR = "792750000";

    handleBlock = provideHandleBlock(provider, SUPPLY_RATE_ABI, startingBlockNumber, utilizationValue);
    const blockEvent = createBlockEvent({
      block: { hash: createAddress("0x123"), number: startingBlockNumber } as Block,
    });
    mockProvider.setNetwork(1);
    mockProvider.addCallTo(cometAddress, startingBlockNumber, proxyInterface, "getSupplyRate", {
      inputs: [utilizationValue],
      outputs: [supplyAPR],
    });

    mockProvider.setNetwork(1);
    mockProvider.addCallTo(cometAddress, 0, proxyInterface, "getSupplyRate", {
      inputs: [utilizationValue],
      outputs: [supplyAPR],
    });
    mockProvider.setLatestBlock(0);
    findings = await handleBlock(blockEvent);
    expect(findings).toStrictEqual([]);

    //100 block

    let highUtilizationValue = 5600000000;
    supplyAPR = "1685500000";
    supplyString = "high";
    supplyRateInfo = supplyAPR;
    action = "invest";
    const secondBlockNumber = 100;
    handleBlock = provideHandleBlock(provider, SUPPLY_RATE_ABI, secondBlockNumber, highUtilizationValue);
    const secondBlockEvent = createBlockEvent({
      block: { hash: createAddress("0x123"), number: secondBlockNumber } as Block,
    });
    mockProvider.setNetwork(1);
    mockProvider.addCallTo(cometAddress, secondBlockNumber, proxyInterface, "getSupplyRate", {
      inputs: [highUtilizationValue],
      outputs: [supplyAPR],
    });

    findings = await handleBlock(secondBlockEvent);

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

    //check at 200
    supplyAPR = "300000000";
    supplyString = "low";
    supplyRateInfo = supplyAPR;
    action = "withdraw";
    const thirdBlockNumber = 200;
    handleBlock = provideHandleBlock(provider, SUPPLY_RATE_ABI, thirdBlockNumber, lowUtilizationValue);
    const thirdBlockEvent = createBlockEvent({
      block: { hash: createAddress("0x123"), number: thirdBlockNumber } as Block,
    });
    mockProvider.setNetwork(1);
    mockProvider.addCallTo(cometAddress, thirdBlockNumber, proxyInterface, "getSupplyRate", {
      inputs: [lowUtilizationValue],
      outputs: [supplyAPR],
    });

    findings = await handleBlock(thirdBlockEvent);

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
});
