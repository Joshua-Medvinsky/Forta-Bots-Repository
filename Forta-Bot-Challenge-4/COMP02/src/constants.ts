export declare type RewardOwed = {
  address: string;
  owed: any;
};

export const REWARDS_ABI = "function getRewardOwed(address comet, address account) view returns (uint256, address)";
export const WRONG_REWARDS_ABI =
  "function fooRewardOwed(address comet, address account) view returns (uint256, address)";
export const REWARDS_CONTRACT_ADDRESS = "0x1B0e765F6224C21223AeA2af16c1C46E38885a40";
export const DAI_TOKEN_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
