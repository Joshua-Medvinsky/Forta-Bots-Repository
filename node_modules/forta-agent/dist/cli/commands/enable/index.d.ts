import { CommandHandler } from "../..";
import { AppendToFile } from "../../utils/append.to.file";
import AgentRegistry from "../../contracts/agent.registry";
import { GetCredentials } from "../../utils/get.credentials";
export default function provideEnable(appendToFile: AppendToFile, getCredentials: GetCredentials, agentRegistry: AgentRegistry, agentId: string): CommandHandler;
