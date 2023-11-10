import { RunHandlersOnTransaction } from "../../utils/run.handlers.on.transaction";
export declare type RunTransaction = (txHash: string) => Promise<void>;
export declare function provideRunTransaction(runHandlersOnTransaction: RunHandlersOnTransaction): RunTransaction;
