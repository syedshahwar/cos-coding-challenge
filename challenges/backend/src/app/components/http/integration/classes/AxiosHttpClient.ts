import axios, { AxiosResponse, AxiosError } from "axios";
import { injectable } from "inversify";
import { IHttpClient } from "../interface/IHttpClient";
import { IHttpResponse } from "../../dto/interface/IHttpResponse";
import { IHttpRequest } from "../../dto/interface/IHttpRequest";
import querystring from "querystring";
import { IHttpResponseError } from "../../dto/interface/IHttpResponseError";

@injectable()
export class AxiosHttpClient implements IHttpClient {

    public async put<T>(request: IHttpRequest): Promise<IHttpResponse<T>> {
        try {
            this.formatURLWithPathParams(request);
            this.formatURLWithQueryParameters(request);
            const response = await axios.put<T, AxiosResponse<T>>(request.url, request.body);
            return this.formatResponse(response);
        } catch(err) {
            throw this.formatResponseError(err);
        }
    }

    public async get<T>(request: IHttpRequest): Promise<IHttpResponse<T>> {
        try{
            this.formatURLWithPathParams(request);
            this.formatURLWithQueryParameters(request);
            const response = await axios.get<T, AxiosResponse<T>>(request.url, { headers: request.headers });
            return this.formatResponse(response);
        } catch(err) {
            throw this.formatResponseError(err);
        }
    }

    private formatURLWithQueryParameters(request: IHttpRequest): void {
        if(request.query) {
            const query = querystring.stringify(request.query);
            const url = `${request.url}?${query}`;
            request.url = url;
        }
    }

    private formatURLWithPathParams(request: IHttpRequest): void {
        if(request.params) {
            const formattedURL = Object
                .keys(request.params)
                .reduce((acc, param) => {
                    acc = acc.replace(`\${${param}}`, request.params[param])
                    return acc;
                }, request.url);
            request.url = formattedURL;
        }
    }

    private formatResponse<T>(response: AxiosResponse<T>): IHttpResponse<T> {
        const result: IHttpResponse<T> = {
            statusCode: response.status,
            headers: response.headers,
            data: response.data as T,
        }
        return result;
    }

    private formatResponseError(response: AxiosError): IHttpResponseError {
        const result: IHttpResponseError = {
            statusCode: response.response?.status || 500,
            headers: response.response?.headers,
            name: 'HttpError',
            message: response.response?.statusText || 'Internal Server Error',
        }
        return result;
    }

}