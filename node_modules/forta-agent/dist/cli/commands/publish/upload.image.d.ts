import shelljs from "shelljs";
export declare type UploadImage = (runtimeArgs?: any) => Promise<string>;
export default function provideUploadImage(shell: typeof shelljs, imageRepositoryUrl: string, imageRepositoryUsername: string, imageRepositoryPassword: string, agentName: string, contextPath: string): UploadImage;
