import { Injectable } from '@nestjs/common';
import {
    HealthCheckError,
    HealthIndicator,
    HealthIndicatorResult,
} from '@nestjs/terminus';
import { InjectRedis } from './redis.decorator';
import { Redis } from './redis.interface';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
    constructor(@InjectRedis() private readonly _redis: Redis) {
        super();
    }

    async pingCheck(): Promise<HealthIndicatorResult> {
        try {
            const result = await this._redis.ping();
            if (result === 'PONG') {
                return {
                    redis: {
                        status: 'up',
                    },
                };
            }
        } catch (error) {
            throw new HealthCheckError('Redis ping failed', error);
        }
    }
}
