import { CommandHandler } from "../..";
import AgentRegistry from "../../contracts/agent.registry";
import { GetFromIpfs, IpfsManifestData } from "../../utils/ipfs/get.from.ipfs";
import { providers } from "ethers";
import { GetLogsFromPolyscan } from "../../utils/polyscan/get.logs.from.polyscan";
export default function provideInfo(agentId: string, args: any, ethersAgentRegistryProvider: providers.JsonRpcProvider, agentRegistry: AgentRegistry, agentRegistryContractAddress: string, getFromIpfs: GetFromIpfs, getLogsFromPolyscan: GetLogsFromPolyscan): CommandHandler;
export declare const formatIpfsData: (data: IpfsManifestData, isBotEnabled: boolean) => {
    name: string;
    agentId: string;
    status: string;
    version: string;
    owner: string;
    image: string;
    publishedFrom: string;
    timestamp: string;
    documentation: string;
};
export declare const formatDate: (date: Date) => string;
