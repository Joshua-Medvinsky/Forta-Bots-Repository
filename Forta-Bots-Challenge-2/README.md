# Uniswap V3 Swap Detector

## Description

This bot detects when a swap is made on Uniswap V3 pools

## Supported Chains

- Ethereum
- Polygon


## Alerts



- FORTA-1
  - Fired when a new swap is made on Uniswap V3 pools
  - Severity is always set to "low" 
  - Type is always set to "info" 
  - Metadata:
    - sender: The initiator of the smart contract call.
    - recipient: The party receiving the swapped tokens.
    - amount0: The quantity of tokens being exchanged.
    - amount1: The quantity of tokens acquired.
    - poolAddress: The address of the smart contract representing the Uniswap V3 pool.
    - liquidity: The total liquidity amount involved in the swap.
## Test Data

The agent behaviour can be verified with the following transaction hash below:
- 0x048ce8c8d7464ff6dface7d4fdef1347c1a696ccf83b1da7f53e610990dfbd6e

