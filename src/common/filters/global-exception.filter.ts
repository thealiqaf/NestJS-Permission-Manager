import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let errorResponse: any = {};

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            message = typeof res === 'string' ? res : (res as any).message;
            errorResponse = res;
        } else if ((exception as any)?.code === 11000) {
            status = HttpStatus.CONFLICT;
            message = 'Duplicate key error';
            errorResponse = {
                code: 11000,
                keyValue: (exception as any)?.keyValue || null,
            };
        } else if ((exception as any)?.name === 'ValidationError') {
            status = HttpStatus.BAD_REQUEST;
            message = (exception as any).message || 'Validation failed';
            errorResponse = {
                errors: (exception as any).errors || null,
            };
        } else {
            this.logger.error(
                `Unexpected error: ${JSON.stringify(exception)}`,
                (exception as any)?.stack,
            );
        }

        response.status(status).json({
            statusCode: status,
            message,
            path: request.url,
            timestamp: new Date().toISOString(),
            ...errorResponse,
        });
    }
}
