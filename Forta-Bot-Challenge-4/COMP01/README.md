# Investment tracker bot for USDC

## Description

The COMP01 bot is a monitoring tool designed to track individual user investments over a 24-hour period, generating alerts when the user surpasses a dynamic threshold during supply events. The associated proxy contract for this bot is [`0x1B0e765F6224C21223AeA2af16c1C46E38885a40`](https://etherscan.io/address/0x1B0e765F6224C21223AeA2af16c1C46E38885a40).

The threshold is established by calculating the average of transactions from the initial transaction throughout the 24-hour period, and it is set at 20% above the average of all transactions within that timeframe.

## Purpose

The primary objective is to monitor individual user addresses for a specified time frame (24hrs) and send alerts when their investments exceed a dynamic threshold. This monitoring is conducted through supply events. 

## Supported Chains

- Ethereum

## Alerts

- **Alert ID:** COMP-01
- **Description:** This alert triggers a notification when a user's investment surpasses a specified threshold within the last 24 hours for the supply events.
- **Severity:** Always set to "low"
- **Type:** Always set to "info"
- **Metadata:**
  - `poolAddress`: Contract pool address
  - `amountOverThreshold`: Amount by which the user exceeds the threshold
  - `userAddress`: User's address

## Test Data

- Can be confirmed on Etheruem
- Test suite for cache threshold titled thresholdCache.spec.ts
