# Forta-Bots-Challenges

## Description

This bot monitors invariants on MakerDAO’s layer 1 escrows for Optimism and Arbitrum

## Supported Chains

- Ethereum
- Optimism
- Arbitrum


## Alerts
 
- New block check layer 1 escrow balances
  - Fired when a new block is mined
  - Severity is always set to "Info" 
  - Type is always set to "Info" 
  - Metadata:
     - escrowBalanceOptimism: Optimism escrow balance,
     - escrowBalanceArbitrum: Arbitrum escrow balance,

- L1 Supply issue
  - Fired when L2 supply is greater than L1 escrow balance
  - Severity is always set to "High" 
  - Type is always set to "Degraded" 
  - Metadata:
    - l1Bal: L1 escrow balance
    - l2Bal: L2 supply balance
## Test Data

The agent behaviour can be verified on Ethereum, Optimism and Arbitrum

