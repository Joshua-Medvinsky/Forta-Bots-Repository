
# Forta-Bots-Challenges

## Description

This bot notifies the user of the current amount of tokens they have in Rewards contract `0x1B0e765F6224C21223AeA2af16c1C46E38885a40`

## Supported Chains

- Ethereum


## Alerts

- COMPOUND-REWARDS-123
  - Fires a notification to notify the user the amount of tokens they have in rewards contract
  - Severity is always set to "info" 
  - Type is always set to "info" 
  - Metadata:
    -rewardToken: type of token in rewards,
    -rewardAmount: amount of the token store in rewards contract
## Test Data

The agent behaviour can be verified on Ethereum,