export declare class BloomFilter {
    readonly m: number | string;
    readonly k: number | string;
    readonly base64Data: string;
    bitSet: BitSet | undefined;
    constructor(m: number | string, k: number | string, base64Data: string);
    has(key: string): boolean;
    private getIndices;
    private getBaseHashes;
}
declare class BitSet {
    readonly m: number;
    readonly base64Data: string;
    private readonly data;
    constructor(m: number, base64Data: string);
    has(index: number): boolean;
}
export {};
