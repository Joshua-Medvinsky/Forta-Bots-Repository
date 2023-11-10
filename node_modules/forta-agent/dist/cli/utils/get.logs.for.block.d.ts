import { providers } from "ethers";
import { Cache } from "flat-cache";
import { JsonRpcLog } from "./get.transaction.receipt";
export declare type GetLogsForBlock = (blockNumber: number) => Promise<JsonRpcLog[]>;
export default function provideGetLogsForBlock(ethersProvider: providers.JsonRpcProvider, cache: Cache): (blockNumber: number) => Promise<any>;
export declare const getCacheKey: (blockNumber: number) => string;
