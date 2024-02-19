import { ethers } from "ethers";
import { REWARDS_CONTRACT_ADDRESS } from "./constants";

export const getRewardOwed = async (
  fromAddress: string,
  provider: ethers.providers.Provider,
  rewardsABI: string,
  blockNumber: number
) => {
  const cometContract = new ethers.Contract(REWARDS_CONTRACT_ADDRESS, [rewardsABI], provider);

  const tokenInfo = await cometContract.baseTrackingAccrued(fromAddress, { blockTag: blockNumber });

  return tokenInfo.toString();
};
