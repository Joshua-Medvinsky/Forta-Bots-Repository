import { LRUCache } from "lru-cache";
import { ethers } from "ethers";

import { BigNumber } from "@ethersproject/bignumber";

export let THRESHOLD: any = ethers.BigNumber.from("10");

export const amountCache: LRUCache<string, { timestamp: number; amount: any }> = new LRUCache({
  max: 1000,
});

export const amountOverThreshold = async (userAddress: string, amount: any, timestamp: number): Promise<number> => {
  const bigAmount = BigNumber.from(amount);
  const bigThreshold = BigNumber.from(THRESHOLD);

  // Check if there is an entry in the cache for the current userAddress
  if (amountCache.has(userAddress)) {
    const cachedData = amountCache.get(userAddress) || { timestamp: 0, amount: "0" };
    const totalAmountWithinDay = BigNumber.from(cachedData.amount).add(bigAmount);

    // Update the cache with the provided timestamp and accumulated amount
    amountCache.set(userAddress, {
      timestamp: timestamp,
      amount: totalAmountWithinDay.toString(),
    });

    // Check if the total amount within the last day is over the threshold
    if (totalAmountWithinDay.gt(bigThreshold)) {
      return totalAmountWithinDay.sub(bigThreshold).toNumber();
    }
  } else {
    // If there is no entry in the cache, update the cache with the provided timestamp and amount
    amountCache.set(userAddress, {
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

// Function to update the threshold as 20% above the average of the amounts stored in the cache
export const calculateNewThreshold = (): void => {
  let totalAmount = BigNumber.from("0");
  let count = 0;

  // Get the generator object
  const cacheValuesGenerator = amountCache.values();

  // Convert the generator into an array using Array.from
  const cacheValues = Array.from(cacheValuesGenerator).filter((value) => value !== undefined) as {
    timestamp: number;
    amount: any;
  }[];

  // Iterate over the array
  for (let i = 0; i < cacheValues.length; i++) {
    const data = cacheValues[i];
    totalAmount = totalAmount.add(BigNumber.from(data.amount));
    count++;
  }

  if (count === 0) {
    // Do not update the threshold if there are no entries in the cache
    return;
  }

  // Calculate the average
  const average = totalAmount.div(count);

  // Calculate the new threshold as 20% above the average
  const newThreshold = average.add(average.mul(20).div(100));

  // Update the global threshold
  THRESHOLD = newThreshold;
};

// Function to clear the cache
export const clearCache = () => {
  amountCache.clear();
};
// Function to clear the cache every 24 hours
export const clearCachePeriodically = () => {
  setInterval(
    () => {
      amountCache.clear();
    },
    24 * 60 * 60 * 1000
  ); // 24 hours in milliseconds
};

// Function to clear the cache once (for testing purposes)
export const clearCachePeriodicallyMock = () => {
  setTimeout(() => {
    amountCache.clear();
  }, 1000); // Wait for 1 second and then clear the cache
};

export const setThreshold = (newThreshold: any): void => {
  THRESHOLD = newThreshold;
};
