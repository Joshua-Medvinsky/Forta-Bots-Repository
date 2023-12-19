import { ethers } from "ethers";
import { SUPPLY_RATE_CONTRACT_ADDRESS } from "./constants";

export const getSupplyRate = async (
  provider: ethers.providers.Provider,
  rewardsABI: string,
  blockNumber: number,
  utilization: number
) => {
  const cometContract = new ethers.Contract(SUPPLY_RATE_CONTRACT_ADDRESS, [rewardsABI], provider);

  const supplyRateInfo = await cometContract.getSupplyRate(utilization, { blockTag: blockNumber });

  return supplyRateInfo;
};

export const checkSupplyRate = async (supplyRate: number) => {
  if (supplyRate < 317100000) {
    return "under one percent";
  } else if (supplyRate > 1585500000) {
    return "over five percent";
  }

  return "within range";
};
