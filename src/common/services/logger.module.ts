import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';

@Module({
    providers: [LoggerService],
    exports: [LoggerService],
})
export class LoggerModule { }
