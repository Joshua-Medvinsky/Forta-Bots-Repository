import { Finding, FindingSeverity, FindingType, HandleTransaction } from "forta-agent";
//import { POOL_INIT_CODE_HASH, UNISWAP_POOL_FUNCTION_SIGNATURE, SWAP_FUNCTION_SIGNATURE } from "./constants";
import { TestTransactionEvent } from "forta-agent-tools/lib/test";
import { createAddress } from "forta-agent-tools";
import { ethers } from "ethers";
import { provideHandleTransaction } from "./agent";
import { SUPPLY_POOL_ADDRESS, SUPPLY_EVENT_SIGNATURE, WRONG_SUPPLY_EVENT_SIGNATURE } from "./constants";
import { clearCache, setThreshold, THRESHOLD, clearSupplyTracker } from "./thresholdCache/thresholdCache";

describe("Compound 3 bot tests", () => {
  const timestamp = Date.now();
  let handleTransaction: HandleTransaction;

  const userDummyAddress = createAddress("0xabc");
  const wrongPoolAddress = createAddress("0x123");

  const mockAmountOne = ethers.BigNumber.from("45");
  const mockAmountTwo = ethers.BigNumber.from("5");
  const mockAmountThree = ethers.BigNumber.from("500");
  const mockEvent = [userDummyAddress, SUPPLY_POOL_ADDRESS.toLowerCase(), mockAmountOne];
  const mockEventTwo = [userDummyAddress, SUPPLY_POOL_ADDRESS.toLowerCase(), mockAmountTwo];
  const mockEventThree = [userDummyAddress, SUPPLY_POOL_ADDRESS.toLowerCase(), mockAmountThree];
  let findings = [];
  let mockTxEvent = new TestTransactionEvent();
  let amountOverThreshold;
  beforeAll(() => {
    handleTransaction = provideHandleTransaction();
    mockTxEvent = new TestTransactionEvent();
  });
  beforeEach(() => {
    clearCache();
    clearSupplyTracker();
    setThreshold(10);
    mockTxEvent = new TestTransactionEvent();
  });

  it("returns empty findings if there are no Supply events", async () => {
    findings = await handleTransaction(mockTxEvent);
    expect(findings).toStrictEqual([]);
  });
  it("returns a empty findings when the transaction is not a Supply", async () => {
    mockTxEvent.setBlock(0);
    mockTxEvent.addEventLog(WRONG_SUPPLY_EVENT_SIGNATURE, SUPPLY_POOL_ADDRESS, mockEvent);

    findings = await handleTransaction(mockTxEvent);
    expect(findings).toStrictEqual([]);
  });
  it("returns a empty findings when the transaction is using the wrong pool address", async () => {
    mockTxEvent.setBlock(0);

    mockTxEvent.setFrom(userDummyAddress).setTo(wrongPoolAddress).setValue("123456789");

    findings = await handleTransaction(mockTxEvent);
    expect(findings).toStrictEqual([]);
  });
  it("returns a empty findings when the transactions does not meet the given threshold", async () => {
    mockTxEvent.setBlock(0);
    mockTxEvent.addEventLog(WRONG_SUPPLY_EVENT_SIGNATURE, SUPPLY_POOL_ADDRESS, mockEventTwo);
    mockTxEvent.setTimestamp(timestamp);

    findings = await handleTransaction(mockTxEvent);
    expect(findings).toStrictEqual([]);
  });
  it("returns findings when a transaction goes over the given threshold", async () => {
    amountOverThreshold = mockAmountOne.sub(THRESHOLD);

    mockTxEvent.setBlock(0);
    mockTxEvent.addEventLog(SUPPLY_EVENT_SIGNATURE, SUPPLY_POOL_ADDRESS, mockEvent);
    mockTxEvent.setTimestamp(timestamp);
    findings = await handleTransaction(mockTxEvent);

    expect(findings).toStrictEqual([
      Finding.fromObject({
        name: "Compound III threshold detector",
        description: "Detected user put " + amountOverThreshold + " over supply threshold",
        alertId: "COMP-01",
        severity: FindingSeverity.Low,
        type: FindingType.Info,
        protocol: "CompoundV3",
        metadata: {
          userAddress: userDummyAddress.toLowerCase(),
          poolAddress: SUPPLY_POOL_ADDRESS.toLowerCase(),
          amountOverThreshold: amountOverThreshold.toString(),
        },
      }),
    ]);
  });
  it("returns findings when multiple transactions goes over the given threshold", async () => {
    const mockTxEventTwo = new TestTransactionEvent();
    mockTxEvent.setBlock(0);
    mockTxEventTwo.setBlock(0);
    mockTxEventTwo.addEventLog(SUPPLY_EVENT_SIGNATURE, SUPPLY_POOL_ADDRESS, mockEventTwo);
    mockTxEvent.addEventLog(SUPPLY_EVENT_SIGNATURE, SUPPLY_POOL_ADDRESS, mockEvent);
    mockTxEvent.setTimestamp(timestamp);
    mockTxEventTwo.setTimestamp(timestamp - 40);
    findings = await handleTransaction(mockTxEventTwo);
    expect(findings).toStrictEqual([]);
    const totalAmountOver = mockAmountOne.add(mockAmountTwo).sub(THRESHOLD);
    findings = await handleTransaction(mockTxEvent);

    expect(findings).toStrictEqual([
      Finding.fromObject({
        name: "Compound III threshold detector",
        description: "Detected user put " + totalAmountOver + " over supply threshold",
        alertId: "COMP-01",
        severity: FindingSeverity.Low,
        type: FindingType.Info,
        protocol: "CompoundV3",
        metadata: {
          userAddress: userDummyAddress.toLowerCase(),
          poolAddress: SUPPLY_POOL_ADDRESS.toLowerCase(),
          amountOverThreshold: totalAmountOver.toString(),
        },
      }),
    ]);
  });
  it("returns findings for a transaction goes over the newly calculated threshold", async () => {
    amountOverThreshold = mockAmountThree.sub(THRESHOLD);
    1;

    mockTxEvent.setBlock(0);
    mockTxEvent.addEventLog(SUPPLY_EVENT_SIGNATURE, SUPPLY_POOL_ADDRESS, mockEventThree);
    mockTxEvent.setTimestamp(timestamp);
    findings = await handleTransaction(mockTxEvent);

    expect(findings).toStrictEqual([
      Finding.fromObject({
        name: "Compound III threshold detector",
        description: "Detected user put " + amountOverThreshold + " over supply threshold",
        alertId: "COMP-01",
        severity: FindingSeverity.Low,
        type: FindingType.Info,
        protocol: "CompoundV3",
        metadata: {
          userAddress: userDummyAddress.toLowerCase(),
          poolAddress: SUPPLY_POOL_ADDRESS.toLowerCase(),
          amountOverThreshold: amountOverThreshold.toString(),
        },
      }),
    ]);
  });
});
