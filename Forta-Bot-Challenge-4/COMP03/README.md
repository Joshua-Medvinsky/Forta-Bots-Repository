
# Forta-Bots-Challenges

## Description

This bot notifies the user of the Supply Rates volatility and whether to invest or not

Proxy contract address: `0xc3d688B66703497DAA19211EEdff47f25384cdc3`

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