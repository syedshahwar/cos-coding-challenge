export interface IHttpResponseError extends Error {
    statusCode: number;
    headers?: any;
}