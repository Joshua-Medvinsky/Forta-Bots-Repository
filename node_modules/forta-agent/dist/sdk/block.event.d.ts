import { Block } from "./block";
import { EventType, Network } from "./index";
export declare class BlockEvent {
    readonly type: EventType;
    readonly network: Network;
    readonly block: Block;
    constructor(type: EventType, network: Network, block: Block);
    get blockHash(): string;
    get blockNumber(): number;
}
