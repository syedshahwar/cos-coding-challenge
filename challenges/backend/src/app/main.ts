import { Container } from "inversify";
import { ILogger } from "./components/logger/interface/ILogger";
import { WinstonLogger } from "./components/logger/classes/WinstonLogger";
import { CarOnSaleClient } from "./services/CarOnSaleClient/classes/CarOnSaleClient";
import { DependencyIdentifier } from "./config/DependencyIdentifiers";
import { AuctionMonitorApp } from "./AuctionMonitorApp";
import { ICarOnSaleClient } from "./services/CarOnSaleClient/interface/ICarOnSaleClient";
import { AxiosHttpClient } from "./components/http/integration/classes/AxiosHttpClient";
import { IHttpClient } from "./components/http/integration/interface/IHttpClient";


/*
 * Create the DI container.
 */
const container = new Container({
    defaultScope: "Singleton",
});

/*
 * Register dependencies in DI environment.
 */
container.bind<ILogger>(DependencyIdentifier.LOGGER).to(WinstonLogger);
container.bind<IHttpClient>(DependencyIdentifier.AXIOS_CLIENT).to(AxiosHttpClient);
container.bind<ICarOnSaleClient>(DependencyIdentifier.CAR_ON_SALE_CLIENT).to(CarOnSaleClient);


/*
 * Inject all dependencies in the application & retrieve application instance.
 */
const app = container.resolve(AuctionMonitorApp);

/*
 * Start the application
 */
(async () => {
    await app.start();
})();
