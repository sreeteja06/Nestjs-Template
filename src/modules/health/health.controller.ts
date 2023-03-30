/* eslint-disable require-await */
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
    HealthCheck,
    HealthCheckResult,
    HealthCheckService,
    HealthIndicatorResult,
    TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { RedisHealthIndicator } from '../redis/redis.health-indicator';

@ApiTags('health')
@Controller('')
export class HealthController {
    constructor(
        private readonly _health: HealthCheckService,
        private readonly _db: TypeOrmHealthIndicator,
        private readonly _redis: RedisHealthIndicator,
    ) {}

    @Get('/healthz')
    @ApiOperation({ summary: 'Health check' })
    @HealthCheck()
    async checkAll(): Promise<string> {
        return 'ok';
    }

    @Get('health/database')
    @HealthCheck()
    async checkDatabase(): Promise<HealthCheckResult> {
        return this._health.check([
            async (): Promise<HealthIndicatorResult> =>
                this._db.pingCheck('database'),
        ]);
    }

    @Get('health/redis')
    @ApiOperation({ summary: 'Health check for Redis' })
    @HealthCheck()
    async checkServices(): Promise<HealthCheckResult> {
        return this._health.check([
            async (): Promise<HealthIndicatorResult> => this._redis.pingCheck(),
        ]);
    }
}
