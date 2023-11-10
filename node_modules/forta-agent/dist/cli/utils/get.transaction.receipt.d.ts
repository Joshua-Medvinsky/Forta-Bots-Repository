import { providers } from "ethers";
import { Cache } from "flat-cache";
import { Log, Receipt } from "../../sdk";
export declare type JsonRpcLog = Omit<Log, 'logIndex' | 'blockNumber' | 'transactionIndex'> & {
    logIndex: string;
    blockNumber: string;
    transactionIndex: string;
};
export declare type JsonRpcTransactionReceipt = Omit<Receipt, 'status' | 'blockNumber' | 'transactionIndex' | 'logs'> & {
    status: string;
    blockNumber: string;
    transactionIndex: string;
    from: string;
    logs: JsonRpcLog[];
};
export declare type GetTransactionReceipt = (txHash: string) => Promise<JsonRpcTransactionReceipt>;
export default function provideGetTransactionReceipt(ethersProvider: providers.JsonRpcProvider, cache: Cache): (txHash: string) => Promise<any>;
