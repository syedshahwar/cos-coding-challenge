import { IUserRole } from "./IUserRole";
import { IAuthenticationChallenge } from "./IAuthenticationChallenge";

export interface IAuthenticationResult {
    authenticated: boolean
    userId: string
    internalUserId: number
    internalUserUUID: string
    token: string
    type: number
    privileges: string
    userRole?: [IUserRole]
    authenticationChallenge?: [IAuthenticationChallenge]
}