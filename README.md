# Forta Bots Repository

This repository contains a collection of bots contributed to the Forta Network, aimed at enhancing blockchain security by building detection bots. These bots are designed to automatically generate alerts for transaction anomalies and state changes, and they are accessible through the Forta App or API.

## Overview

The repository consists of four main bots, each serving a specific purpose in detecting and monitoring various activities on different blockchain networks.

### Bot Descriptions:

1. **Bot Deployment Detector**
   - This agent specializes in detecting instances when a bot is deployed from the Nethermind Deployer Address (`0x88dC3a2284FA62e0027d6D6B1fCfDd2141a143b8`).

2. **Uniswap V3 Swap Detector**
   - This bot focuses on detecting swaps made on Uniswap V3 pools across Ethereum and Polygon networks.

3. **MakerDAO Invariant Bot**
   - Monitors invariants on MakerDAO’s layer 1 escrows for Ethereum, Optimism, and Arbitrum networks.

4. **Compound III Bots**
   - Compound III FORTA bots to track supply rates and user investments and rewards.

### Features:

- Automated alert generation for specific events or anomalies.
- Supports multiple blockchain networks such as Ethereum, Polygon, Optimism, and Arbitrum.
- Detailed metadata included in generated alerts for better analysis.

Each bot is described in detail within its respective directory with information on supported chains, types of alerts, test data, and other relevant details.

## Usage

Each bot directory contains specific instructions on how to deploy and utilize the bot effectively. Please refer to the individual README files for more information.

## Contributions

Contributions to the repository are welcome. If you have suggestions, improvements, or new bot ideas, feel free to open an issue or submit a pull request.

## License

The code in this repository is provided under the [MIT License](LICENSE).

---

*This README provides an overview of the repository and its contents. For detailed information on each bot, refer to their respective README files.*
