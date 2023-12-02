export const L1_ESCROW_OPTIMISM = "0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65";
export const L1_ESCROW_ARBITRUM = "0xA10c7CE4b876998858b1a9E12b10092229539400";

export const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

export const L1_ESCROW_FUNCTION_SIGNATURE = [
  "function balanceOf(address) view returns (uint256)",
];
export const L2_FUNCTION_SIGNATURE = [
  "function totalSupply() view returns (uint256)",
];
export const L2_TOKEN_ADDRESS_MAKER_DAO =
  "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";
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
  metadata?: any;
};
