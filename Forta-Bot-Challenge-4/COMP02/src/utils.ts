import { ethers } from "ethers";
import { REWARDS_CONTRACT_ADDRESS, RewardOwed } from "./constants";

export const getRewardOwed = async (
  cometAddress: string,
  fromAddress: string,
  provider: ethers.providers.Provider,
  rewardsABI: string,
  blockNumber: number
) => {
  const cometContract = new ethers.Contract(REWARDS_CONTRACT_ADDRESS, [rewardsABI], provider);

  // Call the getRewardsOwed method with the required parameters
  const tokenInfo = await cometContract.getRewardOwed(fromAddress, cometAddress, { blockTag: blockNumber });

  const reward: RewardOwed = { address: tokenInfo[1], owed: tokenInfo[0].toString() };

  return reward;
};
