import { LRUCache } from "lru-cache";
import { ethers } from "ethers";

import { BigNumber } from "@ethersproject/bignumber";

export let THRESHOLD: BigNumber = ethers.BigNumber.from("10");

export let totalSupplySum: BigNumber = ethers.BigNumber.from("0");
export let supplyCounter: number = 0;

export const amountCache: LRUCache<string, { timestamp: number; amount: BigNumber }> = new LRUCache({
  max: 1000,
});

export const amountOverThreshold = async (
  userAddress: string,
  amount: BigNumber,
  timestamp: number
): Promise<number> => {
  const bigAmount = BigNumber.from(amount);
  const oldThreshold = THRESHOLD;
  // Check if there is an entry in the cache for the current userAddress
  if (amountCache.has(userAddress)) {
    const cachedData = amountCache.get(userAddress) || { timestamp: 0, amount: BigNumber.from("0") };

    // Check if the new timestamp is within the 24-hour window
    if (timestamp - cachedData.timestamp <= 24 * 60 * 60) {
      const totalAmountWithinDay = BigNumber.from(cachedData.amount).add(bigAmount);

      // Update the cache with the provided timestamp and accumulated amount
      amountCache.set(userAddress, {
        timestamp: timestamp,
        amount: totalAmountWithinDay,
      });

      // Update the counters
      totalSupplySum = totalSupplySum.add(bigAmount);
      supplyCounter++;

      // Calculate the new threshold as 20% above the average
      const average = totalSupplySum.div(supplyCounter);
      THRESHOLD = average.add(average.mul(20).div(100));

      // Check if the total amount within the last day is over the  old threshold
      if (totalAmountWithinDay.gt(oldThreshold)) {
        // Clear the amount to prevent multiple alerts within 24 hours
        amountCache.set(userAddress, { timestamp: timestamp, amount: BigNumber.from("0") });
        return totalAmountWithinDay.sub(oldThreshold).toNumber();
      }
    }
  } else {
    // If there is no entry in the cache, update the cache with the provided timestamp and amount
    amountCache.set(userAddress, {
      timestamp: timestamp,
      amount: bigAmount,
    });

    // Update the counters
    totalSupplySum = totalSupplySum.add(bigAmount);
    supplyCounter++;

    // Calculate the new threshold as 20% above the average
    const average = totalSupplySum.div(supplyCounter);
    THRESHOLD = average.add(average.mul(20).div(100));

    // Check if the current amount is greater than the old threshold
    if (bigAmount.gt(oldThreshold)) {
      // Clear the amount to prevent multiple alerts within 24 hours
      amountCache.set(userAddress, { timestamp: timestamp, amount: BigNumber.from("0") });

      return bigAmount.sub(oldThreshold).toNumber();
    }
  }

  // Return 0 since the total amount within the last day is not over the threshold
  return 0;
};

// Function to clear the cache
export const clearCache = () => {
  amountCache.clear();
  //clear counters too
};

//Function to reset sum and counter
export const clearSupplyTracker = () => {
  totalSupplySum = ethers.BigNumber.from("0");
  supplyCounter = 0;
};

// Function to clear the cache every 24 hours for each user
export const clearCachePeriodically = () => {
  setInterval(
    () => {
      // Get the current timestamp
      const currentTime = Date.now();

      // Iterate over the cache entries
      amountCache.forEach((data, userAddress) => {
        // Check if the user's first transaction timestamp is within the last 24 hours
        if (data.timestamp >= currentTime - 24 * 60 * 60 * 1000) {
          // If within the 24-hour window, clear the cache entry for that user
          amountCache.delete(userAddress);
        }
      });
    },
    60 * 60 * 1000
  ); // Run every 1 hour to check and clear the cache
};

export const setThreshold = (newThreshold: any): void => {
  THRESHOLD = newThreshold;
};
