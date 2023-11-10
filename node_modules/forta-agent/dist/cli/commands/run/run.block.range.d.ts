import { RunHandlersOnBlock } from '../../utils/run.handlers.on.block';
export declare type RunBlockRange = (blockRange: string) => Promise<void>;
export declare function provideRunBlockRange(runHandlersOnBlock: RunHandlersOnBlock): RunBlockRange;
