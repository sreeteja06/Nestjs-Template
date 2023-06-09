import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { extractIp } from '../decorators/ip.decorator';
import { getHttpStatusFromError } from '../utils/error.util';
import { QueryFailedError } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CONFIG_KEYS } from '../constants/system.constant';
import { RequestWithUserInfo } from '../common/interface/request';
import { LogLevels } from '../common/enums/log-levels.enum';
import { flattenIfValidationError } from '../utils/validation.util';

// Middleware -> Interceptors -> Route Handler -> Interceptors -> Exception Filter
/**
 * It catches all the exceptions that occur in the route handlers.
 * Logs error if it is internal server error.
 */
@Catch()
export class ErrorFilter implements ExceptionFilter {
    private readonly logger = new Logger(ErrorFilter.name);
    private readonly isProduction;

    constructor(private readonly configService: ConfigService) {
        this.isProduction =
            configService.get(CONFIG_KEYS.NODE_ENV) === 'production';
    }

    static buildErrorResponse(
        response: Response,
        status: number,
        message: string,
        extra?: unknown,
    ): Response {
        return response
            .status(status)
            .send({ statusCode: status, message, extra });
    }

    public catch(error: Error, host: ArgumentsHost): Response {
        const response: Response = host.switchToHttp().getResponse();
        const req: RequestWithUserInfo = host.switchToHttp().getRequest();

        this._logError(error, req);

        if (error instanceof QueryFailedError) {
            if (error.driverError.code === 'ER_DUP_ENTRY') {
                return ErrorFilter.buildErrorResponse(
                    response,
                    HttpStatus.CONFLICT,
                    'Duplicate',
                );
            }
        }

        const status = getHttpStatusFromError(error);

        switch (status) {
            case HttpStatus.NOT_FOUND:
                return ErrorFilter.buildErrorResponse(
                    response,
                    status,
                    'Not Found',
                );
            case HttpStatus.BAD_REQUEST:
                return ErrorFilter.buildErrorResponse(
                    response,
                    status,
                    error.message,
                    this.isProduction
                        ? undefined
                        : flattenIfValidationError(error),
                );
            case HttpStatus.INTERNAL_SERVER_ERROR:
                return response.status(status).send({
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: this.isProduction ? undefined : error.message,
                });
            default:
                return ErrorFilter.buildErrorResponse(
                    response,
                    status,
                    error.message,
                );
        }
    }

    private _logError(error: Error, req: RequestWithUserInfo): void {
        const httpStatus = getHttpStatusFromError(error);

        if (
            (httpStatus !== HttpStatus.NOT_FOUND && this.isProduction) ||
            !this.isProduction
        ) {
            let logLevel = LogLevels.ERROR;
            if (
                httpStatus &&
                httpStatus >= HttpStatus.BAD_REQUEST &&
                httpStatus < HttpStatus.INTERNAL_SERVER_ERROR
            ) {
                logLevel = LogLevels.WARN;
            }
            this.logger[logLevel](error, {
                context: {
                    ip: extractIp(req),
                    url: req.originalUrl,
                    method: req.method,
                    statusCode: httpStatus,
                    message: error.message,
                    userId: req.user?.sub,
                },
            });
        }
    }
}
