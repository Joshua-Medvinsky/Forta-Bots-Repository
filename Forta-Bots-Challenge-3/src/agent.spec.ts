import {
  Finding,
  FindingSeverity,
  FindingType,
  ethers,
  HandleBlock,
  createBlockEvent,
  Alert,
  Block,
  Initialize,
} from "forta-agent";
import {
  L1_ESCROW_ARBITRUM,
  L1_ESCROW_OPTIMISM,
  DAI_ADDRESS,
  L2_FUNCTION_SIGNATURE,
  L1_ESCROW_FUNCTION_SIGNATURE,
  L2_TOKEN_ADDRESS_MAKER_DAO,
  BOT_ID,
} from "./constants";
import { MockEthersProvider } from "forta-agent-tools/lib/test";
import { createAddress } from "forta-agent-tools";
import { AlertInput } from "forta-agent-tools/lib/utils";
import { BigNumber } from "ethers";
import { provideHandleBlock, provideInitialize } from "./agent";

const networkA = "Arbitrum";
const networkO = "Optimism";

const networkAChainID = 42161;
const networkOChainID = 10;

const blockNumber = 25;
// Mock values when escrow < l2 supply
const MOCK_VALUES_1 = {
  OPTIMISM_L1_ESCROW_BAL: BigNumber.from("25"),
  ARBITRUM_L1_ESCROW_BAL: BigNumber.from("30"),
  OPTIMISM_L2_BAL: BigNumber.from("100"),
  ARBITRUM_L2_BAL: BigNumber.from("90"),
};

// Mock values when escrow > l2 supply
const MOCK_VALUES_2 = {
  OPTIMISM_L1_ESCROW_BAL: BigNumber.from("100"),
  ARBITRUM_L1_ESCROW_BAL: BigNumber.from("90"),
  OPTIMISM_L2_BAL: BigNumber.from("25"),
  ARBITRUM_L2_BAL: BigNumber.from("30"),
};

const getAlertInput = (): AlertInput => {
  let alertInput: AlertInput = {
    addresses: [createAddress("0x1234")],
    alertId: "L1-BLOCK-CHECK-ESCROWS",
    description: "L1 escrow DAI supply is low",
    findingType: "Info",
    name: "L1_ESCROW_ALERT",
    severity: "Info",
    alertDocumentType: "Alert",
    source: {
      bot: { id: BOT_ID },
    },
    metadata: {
      escrowBalanceOptimism: MOCK_VALUES_1.OPTIMISM_L1_ESCROW_BAL,
      escrowBalanceArbitrum: MOCK_VALUES_1.ARBITRUM_L1_ESCROW_BAL,
    },
  };

  return alertInput;
};

const alert = Alert.fromObject(getAlertInput());
const alerts: Alert[] = [];
alerts.push(alert);

const mockGetAlerts = jest.fn();

// Mock implementation for getAlerts
mockGetAlerts.mockResolvedValue({
  alerts: [...alerts],
});

const L1_PROXY = new ethers.utils.Interface(L1_ESCROW_FUNCTION_SIGNATURE);
const L2_PROXY = new ethers.utils.Interface(L2_FUNCTION_SIGNATURE);

describe("MakerDAO’s Bridge Invariant checks", () => {
  let handleBlock: HandleBlock;
  let provider: any;
  let mockProvider: any;
  let initialize: Initialize;

  beforeEach(() => {
    mockProvider = new MockEthersProvider();
    provider = mockProvider as unknown as ethers.providers.Provider;
    initialize = provideInitialize(mockProvider);
  });

  it("eth network balance check", async () => {
    mockProvider.setNetwork(1);
    await initialize();
    handleBlock = provideHandleBlock(provider, mockGetAlerts);
    const blockEvent = createBlockEvent({
      block: { hash: createAddress("0x123"), number: blockNumber } as Block,
    });

    mockProvider
      .addCallTo(DAI_ADDRESS, blockNumber, L1_PROXY, "balanceOf", {
        inputs: [L1_ESCROW_OPTIMISM],
        outputs: [MOCK_VALUES_1.OPTIMISM_L1_ESCROW_BAL],
      })
      .addCallTo(DAI_ADDRESS, blockNumber, L1_PROXY, "balanceOf", {
        inputs: [L1_ESCROW_ARBITRUM],
        outputs: [MOCK_VALUES_1.ARBITRUM_L1_ESCROW_BAL],
      });

    const findings = await handleBlock(blockEvent);

    const expectedFindings = Finding.fromObject({
      name: `Combined supply of optimism and Arbitrum MakerDao escrows on layer 1`,
      description: `Escrow balances: Arbitrum: ${MOCK_VALUES_1.ARBITRUM_L1_ESCROW_BAL} Optimism: ${MOCK_VALUES_1.OPTIMISM_L1_ESCROW_BAL}`,
      alertId: "new block check escrows on layer 1",
      severity: FindingSeverity.Info,
      type: FindingType.Info,
      protocol: "Ethereum",
      metadata: {
        escrowBalanceOptimism: `${MOCK_VALUES_1.OPTIMISM_L1_ESCROW_BAL}`,
        escrowBalanceArbitrum: `${MOCK_VALUES_1.ARBITRUM_L1_ESCROW_BAL}`,
      },
    });

    expect(findings).toStrictEqual([expectedFindings]);
  });

  it("returns empty findings if the layer one escrow dai balance is greater than Optimism Layer 2 supply", async () => {
    mockProvider.setNetwork(networkOChainID);
    await initialize();
    handleBlock = provideHandleBlock(provider, mockGetAlerts);
    const blockEvent = createBlockEvent({
      block: { hash: createAddress("0x123"), number: blockNumber } as Block,
    });

    mockProvider.addCallTo(
      L2_TOKEN_ADDRESS_MAKER_DAO,
      blockNumber,
      L2_PROXY,
      "totalSupply",
      {
        inputs: [],
        outputs: [MOCK_VALUES_2.OPTIMISM_L2_BAL],
      },
    );

    const findings = await handleBlock(blockEvent);

    expect(findings).toStrictEqual([]);
  });

  it("returns empty findings if the layer one escrow dai balance is greater than Arbitrum Layer 2 supply", async () => {
    mockProvider.setNetwork(networkAChainID);
    await initialize();
    handleBlock = provideHandleBlock(provider, mockGetAlerts);
    const blockEvent = createBlockEvent({
      block: { hash: createAddress("0x123"), number: blockNumber } as Block,
    });

    mockProvider.addCallTo(
      L2_TOKEN_ADDRESS_MAKER_DAO,
      blockNumber,
      L2_PROXY,
      "totalSupply",
      {
        inputs: [],
        outputs: [MOCK_VALUES_2.ARBITRUM_L2_BAL],
      },
    );

    const findings = await handleBlock(blockEvent);

    expect(findings).toStrictEqual([]);
  });

  it("returns a finding if the optimism layer 2 dai supply is more then the layer 1 escrow dai balance", async () => {
    mockProvider.setNetwork(networkOChainID);
    await initialize();
    handleBlock = provideHandleBlock(provider, mockGetAlerts);
    const blockEvent = createBlockEvent({
      block: { hash: createAddress("0x123"), number: blockNumber } as Block,
    });

    mockProvider.addCallTo(
      L2_TOKEN_ADDRESS_MAKER_DAO,
      blockNumber,
      L2_PROXY,
      "totalSupply",
      {
        inputs: [],
        outputs: [MOCK_VALUES_1.OPTIMISM_L2_BAL],
      },
    );

    const findings = await handleBlock(blockEvent);

    const expectedFindings = Finding.fromObject({
      name: `${networkO} layer 2 dai supply is more then the layer 1 escrow dai balance`,
      description: `L1Escrow Balance: ${MOCK_VALUES_1.OPTIMISM_L1_ESCROW_BAL}, ${networkO} L2Supply Balance: ${MOCK_VALUES_1.OPTIMISM_L2_BAL}`,
      alertId: `L1 ${networkO} supply issue`,
      severity: FindingSeverity.High,
      type: FindingType.Degraded,
      protocol: `${networkO}`,
      metadata: {
        L1Bal: `${MOCK_VALUES_1.OPTIMISM_L1_ESCROW_BAL}`,
        L2Bal: `${MOCK_VALUES_1.OPTIMISM_L2_BAL}`,
      },
    });

    expect(findings).toStrictEqual([expectedFindings]);
  });

  it("returns a finding if the arbitrum layer 2 dai supply is more then the layer 1 escrow dai balance", async () => {
    mockProvider.setNetwork(networkAChainID);
    await initialize();
    handleBlock = provideHandleBlock(provider, mockGetAlerts);
    const blockEvent = createBlockEvent({
      block: { hash: createAddress("0x123"), number: blockNumber } as Block,
    });

    mockProvider.addCallTo(
      L2_TOKEN_ADDRESS_MAKER_DAO,
      blockNumber,
      L2_PROXY,
      "totalSupply",
      {
        inputs: [],
        outputs: [MOCK_VALUES_1.ARBITRUM_L2_BAL],
      },
    );

    const findings = await handleBlock(blockEvent);

    const expectedFindings = Finding.fromObject({
      name: `${networkA} layer 2 dai supply is more then the layer 1 escrow dai balance`,
      description: `L1Escrow Balance: ${MOCK_VALUES_1.ARBITRUM_L1_ESCROW_BAL}, ${networkA} L2Supply Balance: ${MOCK_VALUES_1.ARBITRUM_L2_BAL}`,
      alertId: `L1 ${networkA} supply issue`,
      severity: FindingSeverity.High,
      type: FindingType.Degraded,
      protocol: `${networkA}`,
      metadata: {
        L1Bal: `${MOCK_VALUES_1.ARBITRUM_L1_ESCROW_BAL}`,
        L2Bal: `${MOCK_VALUES_1.ARBITRUM_L2_BAL}`,
      },
    });

    expect(findings).toStrictEqual([expectedFindings]);
  });
});
