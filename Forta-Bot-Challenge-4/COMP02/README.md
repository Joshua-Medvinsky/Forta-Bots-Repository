# Rewards tracker bot

## Description

This bot notifies the user of the current amount of tokens they have in USDC Rewards contract [`0x0x285617313887d43256F852cAE0Ee4de4b68D45B0`](https://etherscan.io/address/0x285617313887d43256F852cAE0Ee4de4b68D45B0)

Utilizes the function below:
  -  function `baseTrackingAccrued(address account) external view returns (uint64);`
     -  Calculates the amount of a USDC token owed to an account
     - `account` The account to check rewards for
  - Function is located on rewards contract: `0x285617313887d43256F852cAE0Ee4de4b68D45B0`(https://etherscan.io/address/0x285617313887d43256F852cAE0Ee4de4b68D45B0).

## Purpose

The objective is to regularly update and notify users about their rewards every 1000 blocks, ensuring they stay informed.

## Supported Chains

- Ethereum


## Alerts

- COMPOUND-REWARDS-123
  - Fires a notification to notify the user the amount of USDC tokens they have in rewards contract
  - Severity is always set to "info" 
  - Type is always set to "info" 
  - Metadata:
    -rewardToken: type of token in rewards,
    -rewardAmount: amount of the token store in rewards contract
## Test Data

The agent behaviour can be verified on Ethereum,