import { GetJsonFile } from '../../utils';
import { GetAgentHandlers } from '../../utils/get.agent.handlers';
import { RunHandlersOnAlert } from '../../utils/run.handlers.on.alert';
import { RunHandlersOnBlock } from '../../utils/run.handlers.on.block';
import { RunHandlersOnTransaction } from '../../utils/run.handlers.on.transaction';
import { RunSequence } from './run.sequence';
export declare type RunFile = (filePath: string) => Promise<void>;
export declare function provideRunFile(getAgentHandlers: GetAgentHandlers, getJsonFile: GetJsonFile, runHandlersOnBlock: RunHandlersOnBlock, runHandlersOnTransaction: RunHandlersOnTransaction, runHandlersOnAlert: RunHandlersOnAlert, runSequence: RunSequence): RunFile;
