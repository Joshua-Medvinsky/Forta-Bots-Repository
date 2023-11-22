# Forta-Bots-Challenges

## Description

This agent detects when a swap is made on Uniswap V3 pools

## Supported Chains

- Ethereum
- Polygon


## Alerts

Describe each of the type of alerts fired by this agent

- FORTA-1
  - Fired when a new swap is made onUniswap V3 pools
  - Severity is always set to "low" 
  - Type is always set to "info" 
  - Metadata:
    -sender: The initiator of the smart contract call.
    -recipient: The party receiving the swapped tokens.
    -amount0: The quantity of tokens being exchanged.
    -amount1: The quantity of tokens acquired.
    -poolAddress: The address of the smart contract representing the Uniswap V3 pool.
    -liquidity: The total liquidity amount involved in the swap.
## Test Data

The agent behaviour can be verified with the tests in agent.ts.spec

