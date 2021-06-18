import { IAuthenticationRequest } from "./IAuthenticationRequest";
import { IAuthenticationResult } from "./IAuthenticationResult";
import { IRunningAuctions } from "./IRunningAuctions";

/**
 * This service describes an interface to access auction data from the CarOnSale API.
 */
export interface ICarOnSaleClient {

    authenticate(request: IAuthenticationRequest): Promise<IAuthenticationResult>;
    getRunningAuctions(authenticationData: IAuthenticationResult): Promise<IRunningAuctions>;

}
