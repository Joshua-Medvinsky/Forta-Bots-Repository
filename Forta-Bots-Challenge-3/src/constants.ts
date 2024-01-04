export const L1_ESCROW_OPTIMISM = "0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65";
export const L1_ESCROW_ARBITRUM = "0xA10c7CE4b876998858b1a9E12b10092229539400";

export const L1_DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
export const BALANCE_OF_FUNCTION_ABI = [
  "function balanceOf(address) view returns (uint256)",
];
export const TOTAL_SUPPLY_FUNCTION_ABI = [
  "function totalSupply() view returns (uint256)",
];
export const L2_DAI_ADDRESS =
  "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";

export const BOT_ID = "";

export declare type AlertInput = {
  addresses?: string[];
  alertId?: string;
  hash?: string;
  createdAt?: string;
  description?: string;
  findingType?: string;
  name?: string;
  protocol?: string;
  scanNodeCount?: number;
  severity?: string;
  alertDocumentType?: string;
  relatedAlerts?: string[];
  chainId?: number;
  botId?: string;
  metadata?: any;
};
