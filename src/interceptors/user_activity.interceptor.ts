import {
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, tap } from 'rxjs';
import { RequestWithUserInfo } from '../common/interface/request';
import { getHttpStatusFromError } from '../utils/error.util';
import { isRabbitContext } from '@golevelup/nestjs-rabbitmq';

/**
 * Intercepts the request and records the user activity log into the table.
 */
@Injectable()
export class UserActivityInterceptor<T> implements NestInterceptor {
    private readonly _logger = new Logger(UserActivityInterceptor.name);

    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<T>> {
        if (isRabbitContext(context)) {
            return next.handle();
        }

        const req: RequestWithUserInfo = context.switchToHttp().getRequest();
        const res: Response = context.switchToHttp().getResponse();

        const startTime = Date.now();

        return next.handle().pipe(
            tap({
                next: () => {
                    this._logActivity(req, res.statusCode, startTime);
                },
                // logging while error
                error: (err: Error) => {
                    const statusCode = getHttpStatusFromError(err);
                    this._logActivity(req, statusCode, startTime);
                },
            }),
        );
    }

    private _logActivity(
        req: RequestWithUserInfo,
        statusCode: number,
        startTime: number,
    ): void {
        // if we want to save user activity it goes here
    }
}
