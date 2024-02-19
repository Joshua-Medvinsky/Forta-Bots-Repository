# Compound III Bots

## Summary
- Compound III FORTA bots to track supply rates and user investments and rewards.

## Proposed Bots:
- **COMP01:** Investment tracker bot for USDC
  - Monitors when an individual address stakes a given amount in tokens, emitting an alert when it exceeds a predetermined threshold.
  - Purpose: To track any suspicious investment activity by a user.
- **COMP02:** Rewards tracker bot
  - Informs the user of their rewards.
  - Purpose: To track rewards for a user.
- **COMP03:** Monitor supply rate bot
  - Monitors the supply rate to track volatility and emits an alert when the supply rate fluctuates beyond a specified threshold (e.g., 5% more or less than the starting rate).
  - Purpose: To determine optimal times for investment or withdrawal.

## Proposed Solution:
- **COMP01:** Investment tracker bot
  - Utilizes the event: `Supply(address indexed from, address indexed dst, uint amount);`
    - `from`: User address being monitored.
    - `dst`: Pool address for which the user is supplying stake.
  - Proxy contract address: [`0x1B0e765F6224C21223AeA2af16c1C46E38885a40`](https://etherscan.io/address/0x1B0e765F6224C21223AeA2af16c1C46E38885a40).
  - Issues an alert when the total transaction amount from supply events exceeds a specified threshold within a day for a given address. (Will utilize a cache to monitor activity over a day)
- **COMP02:** Rewards tracker bot
  -  function `baseTrackingAccrued(address account) external view returns (uint64);`
     -  Calculates the amount of a USDC token owed to an account
     - `account` The account to check rewards for
  - Function is located on rewards contract: [`0x285617313887d43256F852cAE0Ee4de4b68D45B0`](https://etherscan.io/address/0x285617313887d43256F852cAE0Ee4de4b68D45B0).
- **COMP03:** Monitor supply rate bot
  - Utilizes function: `getSupplyRate(uint utilization) public view returns (uint64);`
    - `utilization`: The utilization at which to calculate the rate.
    - **RETURNS:** The per-second supply rate as the decimal representation of a percentage scaled up by 10 ^ 18. E.g., 317100000 indicates, roughly, a 1% APR.
  - Monitors the supply rate and suggests when it's an optimal time to invest or withdraw to a user by monitoring the rate over time and emitting an alert when it goes past a certain threshold (e.g., 5%).
   - Proxy contract address: [`0xc3d688B66703497DAA19211EEdff47f25384cdc3`](https://etherscan.io/address/0xc3d688B66703497DAA19211EEdff47f25384cdc3).
