import { AxiosStatic } from "axios";
import { StateChangeContractEvent } from "../../contracts/agent.registry";
export interface EventFilter {
    type: StateChangeContractEvent;
    topicHash: string;
}
export interface PolyscanLog {
    topics: string[];
    timeStamp: number;
    transactionHash: string;
}
export declare type GetLogsFromPolyscan = (address: string, eventFilter: EventFilter, agentId: string) => Promise<any>;
export default function provideGetLogsFromPolyscan(axios: AxiosStatic, polyscanApiUrl: string): GetLogsFromPolyscan;
