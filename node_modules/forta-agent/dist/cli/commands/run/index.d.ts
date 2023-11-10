import { AwilixContainer } from 'awilix';
import { providers } from 'ethers';
import { Cache } from 'flat-cache';
import { CommandHandler } from '../..';
export default function provideRun(container: AwilixContainer, ethersProvider: providers.JsonRpcProvider, chainIds: number[], jsonRpcUrl: string, isProduction: boolean, cache: Cache, args: any): CommandHandler;
