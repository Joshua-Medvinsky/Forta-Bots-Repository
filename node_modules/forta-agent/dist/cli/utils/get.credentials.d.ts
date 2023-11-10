import prompts from "prompts";
import { DecryptKeyfile } from './decrypt.keyfile';
import { GetKeyfile } from './get.keyfile';
export declare type GetCredentials = () => Promise<{
    publicKey: string;
    privateKey: string;
}>;
export default function provideGetCredentials(prompt: typeof prompts, getKeyfile: GetKeyfile, decryptKeyfile: DecryptKeyfile, keyfilePassword?: string): GetCredentials;
