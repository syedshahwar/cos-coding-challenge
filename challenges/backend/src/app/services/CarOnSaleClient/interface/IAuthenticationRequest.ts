export interface IAuthenticationRequest {
    userId: string | undefined;
    password: string | undefined;
    meta?: string;
}