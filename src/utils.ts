import { ethers } from "ethers";
import { Provider } from "@ethersproject/providers";
import { LRUCache } from "lru-cache";
import { POOL_INIT_CODE_HASH } from "./constants";

export const poolAddressCache: LRUCache<string, boolean> = new LRUCache({ max: 1000 });

export const getPoolValues = async (
  poolAddress: string,
  provider: ethers.providers.Provider,
  uniswapPoolABI: string[],
  blockNumber: number
) => {
  const uniswapPoolContract = new ethers.Contract(poolAddress, uniswapPoolABI, provider);
  // Use Promise.all to parallelize the asynchronous calls
  const [token0, token1, fee] = await Promise.all([
    uniswapPoolContract.token0({ blockTag: blockNumber }),
    uniswapPoolContract.token1({ blockTag: blockNumber }),
    uniswapPoolContract.fee({ blockTag: blockNumber }),
  ]);

  return { token0, token1, fee };
};

export const computeAddress = (factoryAddress: string, poolValues: any[], poolHash: string) => {
  const encodedAbiData = ethers.utils.defaultAbiCoder.encode(["address", "address", "uint24"], poolValues);
  const derivationIdentifier = ethers.utils.solidityKeccak256(["bytes"], [encodedAbiData]);
  const poolAddress = ethers.utils.getCreate2Address(factoryAddress, derivationIdentifier, poolHash);
  return poolAddress;
};
export const isUniswapAddress = async (
  poolAddress: string,
  provider: Provider,
  uniswapFactoryAddress: string,
  blockNumber: number,
  token0: string,
  token1: string,
  fee: string
): Promise<boolean> => {
  const cachedResult = poolAddressCache.get(poolAddress);

  if (cachedResult !== undefined) {
    return cachedResult as boolean;
  }

  const finalPoolAddress = computeAddress(uniswapFactoryAddress, [token0, token1, fee], POOL_INIT_CODE_HASH);
  let uniswapAddressBool = finalPoolAddress.toLowerCase() == poolAddress.toLowerCase();
  poolAddressCache.set(poolAddress, uniswapAddressBool);
  return uniswapAddressBool;
};
