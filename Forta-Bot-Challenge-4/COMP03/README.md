# Monitor supply rate bot

## Description

This bot notifies the user of the Supply Rates volatility and whether to invest or not

Proxy contract address: [`0xc3d688B66703497DAA19211EEdff47f25384cdc3`](https://etherscan.io/address/0xc3d688B66703497DAA19211EEdff47f25384cdc3)

Utilizes the function below:
  - function `getSupplyRate(uint utilization) public view returns (uint64);`
    - `utilization`: The utilization at which to calculate the rate.
    - **RETURNS:** The per-second supply rate as the decimal representation of a percentage scaled up by 10 ^ 18. E.g., 317100000 indicates, roughly, a 1% APR.
   - Proxy contract address: [`0xc3d688B66703497DAA19211EEdff47f25384cdc3`](https://etherscan.io/address/0xc3d688B66703497DAA19211EEdff47f25384cdc3).

## Purpose

  Monitor the supply rate and suggest to the user when it's an optimal time to invest or withdrawby monitoring the rate over time and emitting an alert when it goes past a certain threshold (e.g., 5%).

## Supported Chains

- Ethereum



## Alerts

- COMPOUND-SUPPLY-RATE-123
  - Fires a notification when supply rate goes under 1% APR or over 5% APR
  - Severity is always set to "info" 
  - Type is always set to "info" 
  - Metadata:
    -supplyRateInfo:  The per second supply rate as the decimal representation of a percentage scaled up by 10,
    -supplyNotification: String which indicates if it's over or under 5%,
## Test Data

The agent behaviour can be verified on Ethereum,