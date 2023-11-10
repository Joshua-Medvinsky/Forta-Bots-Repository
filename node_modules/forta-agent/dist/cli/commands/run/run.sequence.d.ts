import { RunHandlersOnAlert } from "../../utils/run.handlers.on.alert";
import { RunHandlersOnBlock } from "../../utils/run.handlers.on.block";
import { RunHandlersOnTransaction } from "../../utils/run.handlers.on.transaction";
export declare type RunSequence = (sequence: string) => Promise<void>;
export declare function provideRunSequence(runHandlersOnBlock: RunHandlersOnBlock, runHandlersOnTransaction: RunHandlersOnTransaction, runHandlersOnAlert: RunHandlersOnAlert): RunSequence;
