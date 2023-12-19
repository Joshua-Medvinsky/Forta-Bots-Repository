import { LRUCache } from "lru-cache";
import { THRESHOLD } from "./constants";
import { BigNumber } from "@ethersproject/bignumber";
export const amountCache: LRUCache<string, { timestamp: number; amount: any }> = new LRUCache({
  max: 1000,
});

export const isOverThreshold = async (poolAddress: string, amount: any, timestamp: number): Promise<number> => {
  const bigAmount = BigNumber.from(amount);
  const bigThreshold = BigNumber.from(THRESHOLD);

  // Check if there is an entry in the cache for the current poolAddress
  if (amountCache.has(poolAddress)) {
    const cachedData = amountCache.get(poolAddress) || { timestamp: 0, amount: "0" };
    const totalAmountWithinDay = BigNumber.from(cachedData.amount).add(bigAmount);

    // Update the cache with the provided timestamp and accumulated amount
    amountCache.set(poolAddress, {
      timestamp: timestamp,
      amount: totalAmountWithinDay.toString(),
    });

    // Check if the total amount within the last day is over the threshold
    if (totalAmountWithinDay.gt(bigThreshold)) {
      return totalAmountWithinDay.sub(bigThreshold).toNumber();
    }
  } else {
    // If there is no entry in the cache, update the cache with the provided timestamp and amount
    amountCache.set(poolAddress, {
      timestamp: timestamp,
      amount: bigAmount.toString(),
    });

    // Check if the current amount is greater than the threshold
    if (bigAmount.gt(bigThreshold)) {
      return bigAmount.sub(bigThreshold).toNumber();
    }
  }

  // Return 0 since the total amount within the last day is not over the threshold
  return 0;
};

// Function to clear the cache
export const clearCache = () => {
  amountCache.clear();
};
