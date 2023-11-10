import { CreateTransactionEvent } from ".";
import { Finding } from "../../sdk";
import { GetAgentHandlers } from "./get.agent.handlers";
import { GetBlockWithTransactions } from "./get.block.with.transactions";
import { GetNetworkId } from "./get.network.id";
import { GetTraceData } from "./get.trace.data";
import { GetTransactionReceipt } from "./get.transaction.receipt";
export declare type RunHandlersOnTransaction = (txHash: string) => Promise<Finding[]>;
export declare function provideRunHandlersOnTransaction(getAgentHandlers: GetAgentHandlers, getNetworkId: GetNetworkId, getTransactionReceipt: GetTransactionReceipt, getBlockWithTransactions: GetBlockWithTransactions, getTraceData: GetTraceData, createTransactionEvent: CreateTransactionEvent): RunHandlersOnTransaction;
