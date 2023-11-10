import { RunHandlersOnBlock } from '../../utils/run.handlers.on.block';
export declare type RunBlock = (blockNumberOrHash: string) => Promise<void>;
export declare function provideRunBlock(runHandlersOnBlock: RunHandlersOnBlock): RunBlock;
