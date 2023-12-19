import { Finding, FindingSeverity, FindingType, HandleTransaction } from "forta-agent";
//import { POOL_INIT_CODE_HASH, UNISWAP_POOL_FUNCTION_SIGNATURE, SWAP_FUNCTION_SIGNATURE } from "./constants";
import { TestTransactionEvent, MockEthersProvider } from "forta-agent-tools/lib/test";
import { createAddress } from "forta-agent-tools";
import { ethers } from "ethers";
import { provideHandleTransaction } from "./agent";
import { Provider } from "@ethersproject/abstract-provider";
import { DAI_TOKEN_ADDRESS, REWARDS_ABI, REWARDS_CONTRACT_ADDRESS, RewardOwed, WRONG_REWARDS_ABI } from "./constants";

describe("Compound 3 bot tests", () => {
  let handleTransaction: HandleTransaction;
  let proxyInterface: ethers.utils.Interface;
  const userDummyAddress = createAddress("0xabc");
  const wrongCometAddress = createAddress("0x123");
  const cometAddress = REWARDS_CONTRACT_ADDRESS;
  let mockProvider = new MockEthersProvider();
  let startingBlockNumber = 0;

  const reward: RewardOwed = { address: DAI_TOKEN_ADDRESS, owed: ethers.BigNumber.from("5") };
  //let handleTransaction: HandleTransaction;
  let findings = [];
  let mockTxEvent = new TestTransactionEvent();
  let amountOverThreshold;
  let provider: any;
  beforeEach(() => {
    mockProvider = new MockEthersProvider();
    provider = mockProvider as unknown as Provider;
    handleTransaction = provideHandleTransaction(provider, REWARDS_ABI, startingBlockNumber);
    proxyInterface = new ethers.utils.Interface([REWARDS_ABI]);
    mockTxEvent = new TestTransactionEvent();
  });
  beforeEach(() => {});

  it("returns empty findings if there are no reward events", async () => {
    findings = await handleTransaction(mockTxEvent);
    expect(findings).toStrictEqual([]);
  });
  it("returns a empty findings when the transaction is not a reward", async () => {
    mockTxEvent.setBlock(0);
    proxyInterface = new ethers.utils.Interface([WRONG_REWARDS_ABI]);
    mockTxEvent = new TestTransactionEvent()
      .setFrom(userDummyAddress)
      .setTo(cometAddress)
      .addTraces({
        function: proxyInterface.getFunction("fooRewardOwed"),
        to: cometAddress,
        from: userDummyAddress,
        arguments: [cometAddress, userDummyAddress],

        output: [reward.owed, reward.address],
      });
    mockProvider.setNetwork(1);
    mockProvider.addCallTo(cometAddress, 0, proxyInterface, "fooRewardOwed", {
      inputs: [cometAddress, userDummyAddress],
      outputs: [reward.owed, reward.address],
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
        function: proxyInterface.getFunction("getRewardOwed"),
        to: wrongCometAddress,
        from: userDummyAddress,
        arguments: [cometAddress, userDummyAddress],

        output: [reward.owed, reward.address],
      });
    mockProvider.setNetwork(1);
    mockProvider.addCallTo(cometAddress, 0, proxyInterface, "getRewardOwed", {
      inputs: [cometAddress, userDummyAddress],
      outputs: [reward.owed, reward.address],
    });
    mockProvider.setLatestBlock(0);
    findings = await handleTransaction(mockTxEvent);

    expect(findings).toStrictEqual([]);
  });

  it("returns findings when address is correct", async () => {
    mockTxEvent.setBlock(0);
    mockTxEvent = new TestTransactionEvent()
      .setFrom(userDummyAddress)
      .setTo(cometAddress)
      .addTraces({
        function: proxyInterface.getFunction("getRewardOwed"),
        to: cometAddress,
        from: userDummyAddress,
        arguments: [cometAddress, userDummyAddress],

        output: [reward.owed, reward.address],
      });
    mockProvider.setNetwork(1);
    mockProvider.addCallTo(cometAddress, 0, proxyInterface, "getRewardOwed", {
      inputs: [cometAddress, userDummyAddress],
      outputs: [reward.owed, reward.address],
    });
    mockProvider.setLatestBlock(0);
    findings = await handleTransaction(mockTxEvent);

    expect(findings).toStrictEqual([
      Finding.fromObject({
        name: "Compound III rewards notifier",
        description: "User has " + reward.owed + " in rewards for token: " + reward.address,
        alertId: "COMPOUND-REWARDS-123",
        severity: FindingSeverity.Info,
        type: FindingType.Info,
        protocol: "CompoundV3",
        metadata: {
          rewardToken: reward.address,
          rewardAmount: reward.owed.toString(),
        },
      }),
    ]);
  });
});
