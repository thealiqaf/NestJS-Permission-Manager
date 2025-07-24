import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class LoggerService {
    private readonly logger = new Logger(LoggerService.name);

    log(message: string) {
        this.logger.log(message);
    }

    error(message: string, trace?: string) {
        this.logger.error(message, trace);
    }

    warn(message: string) {
        this.logger.warn(message);
    }

    debug(message: string) {
        this.logger.debug(message);
    }
}