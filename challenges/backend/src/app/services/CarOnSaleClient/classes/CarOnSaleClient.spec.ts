import "reflect-metadata";
import { expect } from 'chai';
import nock from 'nock';
import { CarOnSaleClient } from "./CarOnSaleClient";
import { ICarOnSaleClient } from '../interface/ICarOnSaleClient';
import { AxiosHttpClient } from '../../../components/http/integration/classes/AxiosHttpClient';
import { IHttpResponseError } from '../../../components/http/dto/interface/IHttpResponseError';
import { IRunningAuctions } from "../interface/IRunningAuctions";

describe('CarOnSaleClient', () => {

    describe('Authentication Testing', () => {

        it('should authenticate an user with success', async () => {
            const client: ICarOnSaleClient = new CarOnSaleClient(new AxiosHttpClient());
            const userId = 'test@test.com';
            const password = '123456';
            const CAR_ON_SALE_BASE_URL = process.env.CAR_ON_SALE_BASE_URL || '';
            nock(CAR_ON_SALE_BASE_URL)
                .put(`/v1/authentication/${userId}`)
                .reply(200, { userId, token: 'token' });
            const result = await client.authenticate({userId, password});
            expect(result.userId).to.be.eq(userId);
            expect(result.token).to.be.eq('token');
        });

        it('should catch unauthorized error on authentication', async () => {
            try {
                const client: ICarOnSaleClient = new CarOnSaleClient(new AxiosHttpClient());
                const userId = 'test@test.com';
                const password = '123456';
                const CAR_ON_SALE_BASE_URL = process.env.CAR_ON_SALE_BASE_URL || '';
                nock(CAR_ON_SALE_BASE_URL)
                    .put(`/v1/authentication/${userId}`)
                    .reply(401);
                await client.authenticate({userId, password});
            } catch(err) {
                const error: IHttpResponseError = err as IHttpResponseError;
                expect(error.statusCode).to.be.eq(401);
            }
        });
    });

    describe('Running Auctions Testing', () => {

        it('should retrieve running auctions of authenticated user with success', async () => {
            const client: ICarOnSaleClient = new CarOnSaleClient(new AxiosHttpClient());
            const userId = 'test@test.com';
            const token = 'token';
            const CAR_ON_SALE_BASE_URL = process.env.CAR_ON_SALE_BASE_URL || '';
            const requestPayload = {
                userId,
                token,
                authenticated: true,
                internalUserId: 1,
                internalUserUUID: "04115494-1664-4598-bfff-08de8e02b235",
                type: 1,
                privileges: "{PUBLIC_USER}~{TEST_USER}"
            }
            const resultPatyload: IRunningAuctions = {
                items: [
                    { id: 16000, numBids: 2, minimumRequiredAsk: 14000, currentHighestBidValue: 7000 },
                    { id: 16001, numBids: 3, minimumRequiredAsk: 15000, currentHighestBidValue: 7500 },
                ],
                total: 2,
            }
            nock(CAR_ON_SALE_BASE_URL)
                .get(`/v2/auction/buyer/`)
                .reply(200, resultPatyload, { userid: userId, authtoken: token});
            const result = await client.getRunningAuctions(requestPayload);
            expect(result.total).to.be.eq(2);
        });

        it('should catch business error on running auctions retrieval', async () => {
            try {
                const client: ICarOnSaleClient = new CarOnSaleClient(new AxiosHttpClient());
                const userId = 'test@test.com';
                const token = 'token';
                const CAR_ON_SALE_BASE_URL = process.env.CAR_ON_SALE_BASE_URL || '';
                const requestPayload = {
                    userId,
                    token,
                    authenticated: true,
                    internalUserId: 1,
                    internalUserUUID: "04115494-1664-4598-bfff-08de8e02b235",
                    type: 1,
                    privileges: "{PUBLIC_USER}~{TEST_USER}"
                }
                nock(CAR_ON_SALE_BASE_URL)
                    .get(`/v2/auction/buyer/`)
                    .reply(400);
                await client.getRunningAuctions(requestPayload);
            } catch(err) {
                const error: IHttpResponseError = err as IHttpResponseError;
                expect(error.statusCode).to.be.eq(400);
            }
        });
    });
});