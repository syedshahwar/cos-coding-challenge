import { IHttpResponse } from "../../dto/interface/IHttpResponse";
import { IHttpRequest } from "../../dto/interface/IHttpRequest";

export interface IHttpClient {
    put<T>(request: IHttpRequest): Promise<IHttpResponse<T>>;
    get<T>(request: IHttpRequest): Promise<IHttpResponse<T>>
}