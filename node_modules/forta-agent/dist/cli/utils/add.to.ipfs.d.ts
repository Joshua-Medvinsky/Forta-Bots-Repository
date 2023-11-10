import { AxiosInstance } from "axios";
export declare type AddToIpfs = (value: string) => Promise<string>;
export default function provideAddToIpfs(ipfsHttpClient: AxiosInstance): (value: string) => Promise<any>;
