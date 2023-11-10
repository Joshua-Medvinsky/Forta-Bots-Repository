import AgentController from './agent.controller';
export declare type RunProdServer = () => Promise<void>;
export default function provideRunProdServer(port: string, agentController: AgentController): RunProdServer;
