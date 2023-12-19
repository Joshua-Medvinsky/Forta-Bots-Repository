

# Forta Bots Challenges

## Description

The Forta Bots Challenges bot is designed to monitor user investments exceeding a predefined threshold within the last 24 hours for the supply events. The associated proxy contract for this bot is: `0x1B0e765F6224C21223AeA2af16c1C46E38885a40`.

## Supported Chains

- Ethereum

## Alerts

  - Alert ID: COMPOUND-THRESH-123
  - Description: This alert triggers a notification when a user's investment surpasses a specified threshold within the last 24 hours for the supply events.
  - Severity is always set to "low" 
  - Type is always set to "info" 
  - Metadata:
    - poolAddress: Contract pool address,
    - amountOverThreshold: Amount user is over the threshold,
    - userAddress: Users address,

## Test Data

-Can be confirmed on transaction hash `0xf6af61ff875835e4e2e4b95cc8f0e02c6541a7ea328c50423b31b214241849ca`