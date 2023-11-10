import { providers } from "ethers";
import { Block, Transaction } from "../../sdk";
import { Cache } from 'flat-cache';
export declare type JsonRpcTransaction = Omit<Transaction, 'nonce' | 'data'> & {
    nonce: string;
    input: string;
};
export declare type JsonRpcBlock = Omit<Block, 'number' | 'timestamp' | 'transactions'> & {
    number: string;
    timestamp: string;
    transactions: JsonRpcTransaction[];
};
export declare type GetBlockWithTransactions = (blockHashOrNumber: string | number) => Promise<JsonRpcBlock>;
export default function provideGetBlockWithTransactions(ethersProvider: providers.JsonRpcProvider, cache: Cache): (blockHashOrNumber: string | number) => Promise<any>;
