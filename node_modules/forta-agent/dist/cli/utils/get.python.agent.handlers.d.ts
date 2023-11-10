import { HandleAlert, HandleBlock, HandleTransaction } from "../../sdk";
export declare type GetPythonAgentHandlers = (pythonAgentPath: string) => Promise<{
    handleTransaction?: HandleTransaction;
    handleBlock?: HandleBlock;
    handleAlert?: HandleAlert;
}>;
export declare function provideGetPythonAgentHandlers(contextPath: string): GetPythonAgentHandlers;
