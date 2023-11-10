export declare type DecryptKeyfile = (keyfilePath: string, password: string) => {
    publicKey: string;
    privateKey: string;
};
export declare function provideDecryptKeyfile(): DecryptKeyfile;
