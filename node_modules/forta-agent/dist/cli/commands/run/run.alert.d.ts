import { RunHandlersOnAlert } from "../../utils/run.handlers.on.alert";
export declare type RunAlert = (alertHash: string) => Promise<void>;
export declare function provideRunAlert(runHandlersOnAlert: RunHandlersOnAlert): RunAlert;
