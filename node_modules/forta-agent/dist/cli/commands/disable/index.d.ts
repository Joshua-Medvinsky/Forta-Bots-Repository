import { CommandHandler } from "../..";
import { AppendToFile } from "../../utils/append.to.file";
import { GetCredentials } from "../../utils/get.credentials";
import AgentRegistry from "../../contracts/agent.registry";
export default function provideDisable(appendToFile: AppendToFile, getCredentials: GetCredentials, agentRegistry: AgentRegistry, agentId: string): CommandHandler;
