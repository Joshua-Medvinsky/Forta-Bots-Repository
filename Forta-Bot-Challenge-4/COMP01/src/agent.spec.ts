import { Finding, FindingSeverity, FindingType, HandleTransaction } from "forta-agent";
//import { POOL_INIT_CODE_HASH, UNISWAP_POOL_FUNCTION_SIGNATURE, SWAP_FUNCTION_SIGNATURE } from "./constants";
import { TestTransactionEvent, MockEthersProvider } from "forta-agent-tools/lib/test";
import { createAddress } from "forta-agent-tools";
import { ethers } from "ethers";
import { provideHandleTransaction } from "./agent";
import { Provider } from "@ethersproject/abstract-provider";
import { SUPPLY_POOL_ADDRESS, SUPPLY_EVENT_SIGNATURE, THRESHOLD, WRONG_SUPPLY_EVENT_SIGNATURE } from "./constants";
import { clearCache } from "./utils";

describe("Compound 3 bot tests", () => {
  const timestamp = Date.now();
  let handleTransaction: HandleTransaction;

  const userDummyAddress = createAddress("0xabc");
  const wrongPoolAddress = createAddress("0x123");

  let mockProvider = new MockEthersProvider();

  const mockAmountOne = ethers.BigNumber.from("45");
  const mockAmountTwo = ethers.BigNumber.from("5");
  const mockEvent = [userDummyAddress, createAddress("0x456"), mockAmountOne];
  const mockEventTwo = [userDummyAddress, createAddress("0x456"), mockAmountTwo];
  let findings = [];
  let mockTxEvent = new TestTransactionEvent();
  let amountOverThreshold;
  beforeAll(() => {
    const provider = mockProvider as unknown as Provider;
    handleTransaction = provideHandleTransaction(userDummyAddress);
    mockTxEvent = new TestTransactionEvent();
  });
  beforeEach(() => {
    clearCache();
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
    mockTxEvent.setBlock(0);
    mockTxEvent.addEventLog(SUPPLY_EVENT_SIGNATURE, SUPPLY_POOL_ADDRESS, mockEvent);
    mockTxEvent.setTimestamp(timestamp);
    findings = await handleTransaction(mockTxEvent);
    amountOverThreshold = mockAmountOne.sub(THRESHOLD);
    expect(findings).toStrictEqual([
      Finding.fromObject({
        name: "Compound III threshold detector",
        description: "Detected user put " + amountOverThreshold + " over supply threshold",
        alertId: "COMPOUND-THRESH-123",
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
    findings = await handleTransaction(mockTxEvent);

    amountOverThreshold = mockAmountOne.add(mockAmountTwo).sub(THRESHOLD);
    expect(findings).toStrictEqual([
      Finding.fromObject({
        name: "Compound III threshold detector",
        description: "Detected user put " + amountOverThreshold + " over supply threshold",
        alertId: "COMPOUND-THRESH-123",
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
