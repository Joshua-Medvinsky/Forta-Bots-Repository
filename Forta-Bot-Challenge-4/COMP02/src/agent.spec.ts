import { Finding, FindingSeverity, FindingType, HandleBlock, Block, createBlockEvent } from "forta-agent";
//import { POOL_INIT_CODE_HASH, UNISWAP_POOL_FUNCTION_SIGNATURE, SWAP_FUNCTION_SIGNATURE } from "./constants";
import { MockEthersProvider } from "forta-agent-tools/lib/test";
import { createAddress } from "forta-agent-tools";
import { ethers } from "ethers";
import { provideHandleBlock } from "./agent";
import { Provider } from "@ethersproject/abstract-provider";
import { REWARDS_ABI, REWARDS_CONTRACT_ADDRESS, WRONG_REWARDS_ABI } from "./constants";

describe("Compound 3 bot tests", () => {
  let proxyInterface: ethers.utils.Interface;
  const userDummyAddress = createAddress("0xabc");
  const wrongCometAddress = createAddress("0x321");
  const cometAddress = REWARDS_CONTRACT_ADDRESS;
  let mockProvider = new MockEthersProvider();
  let startingBlockNumber = 0;
  const networkChainID = 1;

  const rewardAmount = ethers.BigNumber.from("5");
  const secondRewardAmount = ethers.BigNumber.from("8");
  const thirdRewardAmount = ethers.BigNumber.from("10");
  let findings = [];

  let provider: any;
  let handleBlock: HandleBlock;
  beforeEach(() => {
    mockProvider = new MockEthersProvider();
    provider = mockProvider as unknown as Provider;

    proxyInterface = new ethers.utils.Interface([REWARDS_ABI]);
  });

  it("returns empty findings if there are no block events", async () => {
    handleBlock = provideHandleBlock(provider, REWARDS_ABI, startingBlockNumber, userDummyAddress, cometAddress);
    const blockEvent = createBlockEvent({
      block: { hash: createAddress("0x123"), number: startingBlockNumber } as Block,
    });
    mockProvider.setNetwork(networkChainID);

    findings = await handleBlock(blockEvent);

    expect(findings).toStrictEqual([]);
  });
  it("returns a empty findings when the block event is not a reward", async () => {
    proxyInterface = new ethers.utils.Interface([WRONG_REWARDS_ABI]);
    handleBlock = provideHandleBlock(provider, WRONG_REWARDS_ABI, startingBlockNumber, userDummyAddress, cometAddress);
    const blockEvent = createBlockEvent({
      block: { hash: createAddress("0x123"), number: startingBlockNumber } as Block,
    });
    mockProvider.setNetwork(networkChainID);

    mockProvider.addCallTo(cometAddress, startingBlockNumber, proxyInterface, "fooRewardOwed", {
      inputs: [userDummyAddress],
      outputs: [rewardAmount],
    });

    findings = await handleBlock(blockEvent);

    expect(findings).toStrictEqual([]);
  });

  it("returns empty findings when comet address is incorrect", async () => {
    handleBlock = provideHandleBlock(provider, REWARDS_ABI, startingBlockNumber, userDummyAddress, wrongCometAddress);
    const blockEvent = createBlockEvent({
      block: { hash: createAddress("0x123"), number: startingBlockNumber } as Block,
    });
    mockProvider.setNetwork(networkChainID);

    mockProvider.addCallTo(cometAddress, startingBlockNumber, proxyInterface, "baseTrackingAccrued", {
      inputs: [userDummyAddress],
      outputs: [rewardAmount],
    });

    findings = await handleBlock(blockEvent);

    expect(findings).toStrictEqual([]);
  });

  it("returns findings when address is correct", async () => {
    handleBlock = provideHandleBlock(provider, REWARDS_ABI, startingBlockNumber, userDummyAddress, cometAddress);
    const blockEvent = createBlockEvent({
      block: { hash: createAddress("0x123"), number: startingBlockNumber } as Block,
    });
    mockProvider.setNetwork(networkChainID);

    mockProvider.addCallTo(cometAddress, startingBlockNumber, proxyInterface, "baseTrackingAccrued", {
      inputs: [userDummyAddress],
      outputs: [rewardAmount],
    });

    findings = await handleBlock(blockEvent);

    expect(findings).toStrictEqual([
      Finding.fromObject({
        name: "Compound III rewards notifier",
        description: "User has " + rewardAmount + " in rewards for token: USDC",
        alertId: "COMPOUND-REWARDS-123",
        severity: FindingSeverity.Info,
        type: FindingType.Info,
        protocol: "CompoundV3",
        metadata: {
          rewardAmount: rewardAmount.toString(),
        },
      }),
    ]);
  });
  it("check every 1000 blocks", async () => {
    handleBlock = provideHandleBlock(provider, REWARDS_ABI, startingBlockNumber, userDummyAddress, cometAddress);
    const blockEvent = createBlockEvent({
      block: { hash: createAddress("0x123"), number: startingBlockNumber } as Block,
    });
    mockProvider.setNetwork(networkChainID);

    mockProvider.addCallTo(cometAddress, startingBlockNumber, proxyInterface, "baseTrackingAccrued", {
      inputs: [userDummyAddress],
      outputs: [rewardAmount],
    });

    findings = await handleBlock(blockEvent);

    expect(findings).toStrictEqual([
      Finding.fromObject({
        name: "Compound III rewards notifier",
        description: "User has " + rewardAmount + " in rewards for token: USDC",
        alertId: "COMPOUND-REWARDS-123",
        severity: FindingSeverity.Info,
        type: FindingType.Info,
        protocol: "CompoundV3",
        metadata: {
          rewardAmount: rewardAmount.toString(),
        },
      }),
    ]);
    //first 1000 blocks
    const secondBlockNumber = 1000;
    handleBlock = provideHandleBlock(provider, REWARDS_ABI, secondBlockNumber, userDummyAddress, cometAddress);

    const secondBlockEvent = createBlockEvent({
      block: { hash: createAddress("0x123"), number: secondBlockNumber } as Block,
    });
    mockProvider.setNetwork(networkChainID);

    mockProvider.addCallTo(cometAddress, secondBlockNumber, proxyInterface, "baseTrackingAccrued", {
      inputs: [userDummyAddress],
      outputs: [secondRewardAmount],
    });

    findings = await handleBlock(secondBlockEvent);

    expect(findings).toStrictEqual([
      Finding.fromObject({
        name: "Compound III rewards notifier",
        description: "User has " + secondRewardAmount + " in rewards for token: USDC",
        alertId: "COMPOUND-REWARDS-123",
        severity: FindingSeverity.Info,
        type: FindingType.Info,
        protocol: "CompoundV3",
        metadata: {
          rewardAmount: secondRewardAmount.toString(),
        },
      }),
    ]);

    //check at 2000 blocks
    const thirdBlockNumber = 1000;
    handleBlock = provideHandleBlock(provider, REWARDS_ABI, thirdBlockNumber, userDummyAddress, cometAddress);
    const thirdBlockEvent = createBlockEvent({
      block: { hash: createAddress("0x123"), number: thirdBlockNumber } as Block,
    });
    mockProvider.setNetwork(networkChainID);

    mockProvider.addCallTo(cometAddress, thirdBlockNumber, proxyInterface, "baseTrackingAccrued", {
      inputs: [userDummyAddress],
      outputs: [thirdRewardAmount],
    });

    findings = await handleBlock(thirdBlockEvent);

    expect(findings).toStrictEqual([
      Finding.fromObject({
        name: "Compound III rewards notifier",
        description: "User has " + thirdRewardAmount + " in rewards for token: USDC",
        alertId: "COMPOUND-REWARDS-123",
        severity: FindingSeverity.Info,
        type: FindingType.Info,
        protocol: "CompoundV3",
        metadata: {
          rewardAmount: thirdRewardAmount.toString(),
        },
      }),
    ]);
  });
});
