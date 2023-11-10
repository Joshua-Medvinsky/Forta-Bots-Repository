import { AxiosInstance } from "axios";
interface DecodedJwt {
    header: any;
    payload: any;
}
export declare const MOCK_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJib3QtaWQiOiIweDEzazM4N2IzNzc2OWNlMjQyMzZjNDAzZTc2ZmMzMGYwMWZhNzc0MTc2ZTE0MTZjODYxeWZlNmMwN2RmZWY3MWYiLCJleHAiOjE2NjAxMTk0NDMsImlhdCI6MTY2MDExOTQxMywianRpIjoicWtkNWNmYWQtMTg4NC0xMWVkLWE1YzktMDI0MjBhNjM5MzA4IiwibmJmIjoxNjYwMTE5MzgzLCJzdWIiOiIweDU1NmY4QkU0MmY3NmMwMUY5NjBmMzJDQjE5MzZEMmUwZTBFYjNGNEQifQ.9v5OiiYhDoEbhZ-abbiSXa5y-nQXa104YCN_2mK7SP0";
export declare type FetchJwt = (claims: object, expiresAt?: Date) => Promise<string>;
export declare const provideFetchJwt: (axios: AxiosInstance) => FetchJwt;
export declare const fetchJwt: FetchJwt;
export declare const decodeJwt: (token: string) => DecodedJwt;
export declare const verifyJwt: (token: string, polygonRpcUrl?: string) => Promise<boolean>;
export {};
