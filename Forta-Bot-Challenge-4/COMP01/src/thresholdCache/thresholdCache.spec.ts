import { ethers } from "ethers";
import {
  clearCache,
  clearCachePeriodicallyMock,
  amountOverThreshold,
  calculateNewThreshold,
  amountCache,
  setThreshold,
  THRESHOLD,
} from "./thresholdCache";

describe("Threshold Cache Functions", () => {
  beforeEach(() => {
    // Set the initial threshold
    setThreshold(10);
    clearCache();
  });

  afterAll(() => {
    // Clear the cache after all tests
    clearCache();
  });

  it("should update the threshold", () => {
    // Initial threshold value
    expect(THRESHOLD.toString()).toEqual("10");

    // Add data to the cache
    amountCache.set("user123", { timestamp: 1, amount: ethers.BigNumber.from("12") });

    // Calculate and update the threshold
    calculateNewThreshold();

    // New threshold value
    expect(THRESHOLD.toString()).not.toEqual("10");
  });

  it("should clear the cache periodically", async () => {
    // Add data to the cache with a timestamp outside the past day (e.g., two days ago)
    const twoDaysAgo = Math.floor(Date.now() / 1000) - 2 * 24 * 60 * 60;
    amountCache.set("user456", { timestamp: twoDaysAgo, amount: ethers.BigNumber.from("15") });

    // Set an interval to clear the cache
    clearCachePeriodicallyMock();

    // Wait for a short time less than the default Jest timeout (e.g., 2000 ms)
    await new Promise((resolve) => setTimeout(resolve, 4900));

    // Check if the cache is cleared
    expect(amountCache.size).toEqual(0);
  });

  it("should return correct amount over threshold", async () => {
    // Add data to the cache
    amountCache.set("user789", { timestamp: 1, amount: ethers.BigNumber.from("8") });

    // Call the function to check the amount over the threshold
    const result = await amountOverThreshold("user789", ethers.BigNumber.from("3"), 2);

    // Check if the result is correct
    expect(result).toEqual(1);
  });

  it("should handle case where cache is empty", () => {
    // Call the function to update the threshold with an empty cache

    calculateNewThreshold();

    // The threshold should remain the same
    expect(THRESHOLD.toString()).toEqual("10");
  });
});
