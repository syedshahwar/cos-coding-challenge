import "reflect-metadata";
import { inject, injectable } from "inversify";
import MathUtil from "./helpers/classes/MathUtil";
import { DependencyIdentifier } from "./config/DependencyIdentifiers";
import { ICarOnSaleClient } from "./services/CarOnSaleClient/interface/ICarOnSaleClient";
import { ILogger } from "./components/logger/interface/ILogger";

const BUYER_ID = process.env.BUYER_ID;
const BUYER_PASSWORD = process.env.BUYER_PASSWORD;

@injectable()
export class AuctionMonitorApp {

    public constructor(
        @inject(DependencyIdentifier.LOGGER) private logger: ILogger,
        @inject(DependencyIdentifier.CAR_ON_SALE_CLIENT) private client: ICarOnSaleClient) {
    }

    public async start(): Promise<void> {
        try {
            this.logger.log(`Auction Monitor started.`);
            const authenticationResult = await this.client.authenticate({ userId: BUYER_ID, password: BUYER_PASSWORD });
            const auctions = await this.client.getRunningAuctions(authenticationResult);
            const total = auctions.total;
            const average = (auctions.items.map(item => item.numBids).reduce(MathUtil.sum, 0)) / total;
            const auctionProgressAveragePercentage = (
                auctions.items.map(item => item.currentHighestBidValue / item.minimumRequiredAsk).reduce(MathUtil.sum, 0))
                / total * 100;
            this.logger.log(`Number of auctions: ${total}`);
            this.logger.log(`Average bids: ${average}`);
            this.logger.log(`Average percentage of the auction progress: ${auctionProgressAveragePercentage}%`);
            process.exit(0);
        } catch (err) {
            this.logger.error(err)
            process.exit(-1);
        }
    }

}
