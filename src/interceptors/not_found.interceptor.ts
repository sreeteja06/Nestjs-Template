import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    NotFoundException,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';
import { IsRowAffected } from '../utils/typeorm.util';
import { DeleteResult, UpdateResult } from 'typeorm';
import { isRabbitContext } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class NotFoundInterceptor implements NestInterceptor {
    // eslint-disable-next-line class-methods-use-this
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<unknown> {
        if (isRabbitContext(context)) {
            return next.handle();
        }

        return next.handle().pipe(
            map((data) => {
                if (
                    data instanceof DeleteResult ||
                    data instanceof UpdateResult
                ) {
                    return IsRowAffected(data);
                }
                return data;
            }),
            tap((data) => {
                if (data === undefined) {
                    throw new NotFoundException();
                }
                return data;
            }),
        );
    }
}
