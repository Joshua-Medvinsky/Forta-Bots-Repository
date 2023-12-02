import {
  Finding,
  FindingSeverity,
  FindingType,
  ethers,
  HandleBlock,
  createBlockEvent,
  Alert,
  Block,
} from "forta-agent";
import {
  L1_ESCROW_ARBITRUM,
  L1_ESCROW_OPTIMISM,
  DAI_ADDRESS,
  L2_FUNCTION_SIGNATURE,
  L1_ESCROW_FUNCTION_SIGNATURE,
  L2_TOKEN_ADDRESS_MAKER_DAO,
  AlertInput,
} from "./constants";
import { MockEthersProvider } from "forta-agent-tools/lib/test";
import { createAddress } from "forta-agent-tools";
import { BigNumber } from "ethers";
import { provideHandleBlock } from "./agent";
const networkA = "Arbitrum";
const networkO = "Optimism";

const networkAChainID = 42161;
const networkOChainID = 10;

const blockNumber = 25;
// Mock values when escrow < l2 supply
const MOCK_VALUES_1 = {
  OPT_ESCROW_VAL: BigNumber.from("25"),
  ARB_ESCROW_VAL: BigNumber.from("30"),
  OPT_L2_VAL: BigNumber.from("100"),
  ARB_L2_val: BigNumber.from("90"),
};

// Mock values when escrow > l2 supply
const MOCK_VALUES_2 = {
  OPT_ESCROW_VAL: BigNumber.from("100"),
  ARB_ESCROW_VAL: BigNumber.from("90"),
  OPT_L2_VAL: BigNumber.from("25"),
  ARB_L2_val: BigNumber.from("30"),
};

const getAlertInput = (): AlertInput => {
  let alertInput: AlertInput = {
    addresses: [createAddress("0x1234")],
    alertId: "L1 escrow supply alert",
    description: "L1 escrow DAI supply is low",
    findingType: "Info",
    name: "L1_ESCROW_ALERT",
    severity: "Info",
    alertDocumentType: "Alert",
    metadata: {
      escrowBalanceOptimism: MOCK_VALUES_1.OPT_ESCROW_VAL,
      escrowBalanceArbitrum: MOCK_VALUES_1.ARB_ESCROW_VAL,
    },
  };

  return alertInput;
};

const alert = Alert.fromObject(getAlertInput());

const L1_PROXY = new ethers.utils.Interface(L1_ESCROW_FUNCTION_SIGNATURE);
const L2_PROXY = new ethers.utils.Interface(L2_FUNCTION_SIGNATURE);

describe("MakerDAO’s Bridge Invariant checks", () => {
  let handleBlock: HandleBlock;
  let provider: any;
  let mockProvider: any;

  beforeEach(() => {
    mockProvider = new MockEthersProvider();
    provider = mockProvider as unknown as ethers.providers.Provider;
  });

  it("eth network balance check", async () => {
    handleBlock = provideHandleBlock(provider, []);
    const blockEvent = createBlockEvent({
      block: { hash: createAddress("0x123"), number: blockNumber } as Block,
    });
    mockProvider.setNetwork(1);
    mockProvider
      .addCallTo(DAI_ADDRESS, blockNumber, L1_PROXY, "balanceOf", {
        inputs: [L1_ESCROW_OPTIMISM],
        outputs: [MOCK_VALUES_1.OPT_ESCROW_VAL],
      })
      .addCallTo(DAI_ADDRESS, blockNumber, L1_PROXY, "balanceOf", {
        inputs: [L1_ESCROW_ARBITRUM],
        outputs: [MOCK_VALUES_1.ARB_ESCROW_VAL],
      });

    const findings = await handleBlock(blockEvent);

    const expectedFindings = Finding.fromObject({
      name: `Combined supply of optimism and Arbitrum MakerDao escrows on layer 1`,
      description: `Escrow balances: Arbitrum: ${MOCK_VALUES_1.ARB_ESCROW_VAL} Optimism: ${MOCK_VALUES_1.OPT_ESCROW_VAL}`,
      alertId: "new block check escrows on layer 1",
      severity: FindingSeverity.Info,
      type: FindingType.Info,
      protocol: "Ethereum",
      metadata: {
        escrowBalanceOptimism: `${MOCK_VALUES_1.OPT_ESCROW_VAL}`,
        escrowBalanceArbitrum: `${MOCK_VALUES_1.ARB_ESCROW_VAL}`,
      },
    });

    expect(findings).toStrictEqual([expectedFindings]);
  });

  it("returns empty findings if the layer one escrow dai balance is greater than Optimism Layer 2 supply", async () => {
    handleBlock = provideHandleBlock(provider, []);
    const blockEvent = createBlockEvent({
      block: { hash: createAddress("0x123"), number: blockNumber } as Block,
    });
    mockProvider.setNetwork(networkOChainID);
    mockProvider.addCallTo(
      L2_TOKEN_ADDRESS_MAKER_DAO,
      blockNumber,
      L2_PROXY,
      "totalSupply",
      {
        inputs: [],
        outputs: [MOCK_VALUES_2.OPT_L2_VAL],
      },
    );

    const findings = await handleBlock(blockEvent);

    expect(findings).toStrictEqual([]);
  });

  it("returns empty findings if the layer one escrow dai balance is greater than Arbitrum Layer 2 supply", async () => {
    handleBlock = provideHandleBlock(provider, []);
    const blockEvent = createBlockEvent({
      block: { hash: createAddress("0x123"), number: blockNumber } as Block,
    });
    mockProvider.setNetwork(networkAChainID);
    mockProvider.addCallTo(
      L2_TOKEN_ADDRESS_MAKER_DAO,
      blockNumber,
      L2_PROXY,
      "totalSupply",
      {
        inputs: [],
        outputs: [MOCK_VALUES_2.ARB_L2_val],
      },
    );

    const findings = await handleBlock(blockEvent);

    expect(findings).toStrictEqual([]);
  });

  it("returns a finding if the optimism layer 2 dai supply is more then the layer 1 escrow dai balance", async () => {
    handleBlock = provideHandleBlock(provider, alert);
    const blockEvent = createBlockEvent({
      block: { hash: createAddress("0x123"), number: blockNumber } as Block,
    });

    mockProvider.setNetwork(networkOChainID);
    mockProvider.addCallTo(
      L2_TOKEN_ADDRESS_MAKER_DAO,
      blockNumber,
      L2_PROXY,
      "totalSupply",
      {
        inputs: [],
        outputs: [MOCK_VALUES_1.OPT_L2_VAL],
      },
    );

    const findings = await handleBlock(blockEvent);

    const expectedFindings = Finding.fromObject({
      name: `${networkO} layer 2 dai supply is more then the layer 1 escrow dai balance`,
      description: `L1Escrow Balance: ${MOCK_VALUES_1.OPT_ESCROW_VAL}, ${networkO} L2Supply Balance: ${MOCK_VALUES_1.OPT_L2_VAL}`,
      alertId: `L1 ${networkO} supply issue`,
      severity: FindingSeverity.High,
      type: FindingType.Degraded,
      protocol: `${networkO}`,
      metadata: {
        L1Bal: `${MOCK_VALUES_1.OPT_ESCROW_VAL}`,
        L2Bal: `${MOCK_VALUES_1.OPT_L2_VAL}`,
      },
    });

    expect(findings).toStrictEqual([expectedFindings]);
  });

  it("returns a finding if the arbitrum layer 2 dai supply is more then the layer 1 escrow dai balance", async () => {
    handleBlock = provideHandleBlock(provider, alert);
    const blockEvent = createBlockEvent({
      block: { hash: createAddress("0x123"), number: blockNumber } as Block,
    });
    mockProvider.setNetwork(networkAChainID);
    mockProvider.addCallTo(
      L2_TOKEN_ADDRESS_MAKER_DAO,
      blockNumber,
      L2_PROXY,
      "totalSupply",
      {
        inputs: [],
        outputs: [MOCK_VALUES_1.ARB_L2_val],
      },
    );

    const findings = await handleBlock(blockEvent);

    const expectedFindings = Finding.fromObject({
      name: `${networkA} layer 2 dai supply is more then the layer 1 escrow dai balance`,
      description: `L1Escrow Balance: ${MOCK_VALUES_1.ARB_ESCROW_VAL}, ${networkA} L2Supply Balance: ${MOCK_VALUES_1.ARB_L2_val}`,
      alertId: `L1 ${networkA} supply issue`,
      severity: FindingSeverity.High,
      type: FindingType.Degraded,
      protocol: `${networkA}`,
      metadata: {
        L1Bal: `${MOCK_VALUES_1.ARB_ESCROW_VAL}`,
        L2Bal: `${MOCK_VALUES_1.ARB_L2_val}`,
      },
    });

    expect(findings).toStrictEqual([expectedFindings]);
  });
});
