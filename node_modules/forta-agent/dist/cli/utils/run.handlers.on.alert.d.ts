import { CreateAlertEvent } from ".";
import { Alert, Finding } from "../../sdk";
import { GetAgentHandlers } from "./get.agent.handlers";
import { GetAlert } from "./get.alert";
export declare type RunHandlersOnAlert = (alertOrHash: string | Alert) => Promise<Finding[]>;
export declare function provideRunHandlersOnAlert(getAgentHandlers: GetAgentHandlers, getAlert: GetAlert, createAlertEvent: CreateAlertEvent): RunHandlersOnAlert;
