import { ICarOnSaleClient } from "../interface/ICarOnSaleClient";
import { IRunningAuctions } from "../interface/IRunningAuctions";
import { IHttpClient } from "../../../components/http/integration/interface/IHttpClient";
import { injectable, inject } from "inversify";
import { DependencyIdentifier } from "../../../config/DependencyIdentifiers";
import { IAuthenticationRequest } from "../interface/IAuthenticationRequest";
import { IAuthenticationResult } from "../interface/IAuthenticationResult";

const CAR_ON_SALE_BASE_URL = process.env.CAR_ON_SALE_BASE_URL;

@injectable()
export class CarOnSaleClient implements ICarOnSaleClient {

    public constructor(@inject(DependencyIdentifier.AXIOS_CLIENT) private client: IHttpClient) {}

    public async authenticate(request: IAuthenticationRequest): Promise<IAuthenticationResult> {
        try {
            const result = await this.client.put<IAuthenticationResult>({
                url: `${CAR_ON_SALE_BASE_URL}/v1/authentication/\${userMailId}`,
                params: {
                    userMailId: request.userId,
                },
                body: {
                    password: request.password,
                },
            });
            return result.data as IAuthenticationResult;
        } catch(err) {
            throw err;
        }
    }

    public async getRunningAuctions(authenticationData: IAuthenticationResult): Promise<IRunningAuctions> {
        try {
            const result = await this.client.get<IRunningAuctions>({
                url: `${CAR_ON_SALE_BASE_URL}/v2/auction/buyer/`,
                headers: {
                    userid: authenticationData.userId,
                    authtoken: authenticationData.token,
                }
            });
            return result.data as IRunningAuctions;
        } catch(err) {
            throw err;
        }
    }

}