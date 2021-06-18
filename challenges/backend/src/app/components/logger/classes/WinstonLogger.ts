import { format, createLogger, Logger, transports } from "winston";
import { ILogger } from "../interface/ILogger";
const { timestamp, colorize, printf, combine } = format;
import { injectable } from "inversify";
import "reflect-metadata";

const LOG_LEVEL = process.env.LOG_LEVEL || 'error';

@injectable()
export class WinstonLogger implements ILogger {

    private logger: Logger;

    public constructor() {
        this.logger = createLogger({
            level: LOG_LEVEL,
            levels,
            format: this.format(),
            transports: this.transports(),
          })
    }

    public debug(message: string): void {
        this.logger.debug(message);
    }

    public info(message: string): void {
        this.logger.info(message);
    }

    public warn(message: string): void {
        this.logger.warn(message);
    }

    public error(message: string): void {
        this.logger.error(message);
    }

    public log(message: string): void {
        this.logger.log(LOG_LEVEL, message);
    }

    private format(): any {
        return combine(
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
            colorize({ all: true }),
            printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
        );
    }

    private transports(): any[] {
        return [
            new transports.Console(),
        ]
    }

}

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}