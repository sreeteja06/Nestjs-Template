import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { RedisModuleAsyncOptions } from './redis.interface';
import {
    REDIS_MODULE_CONNECTION_TOKEN,
    REDIS_MODULE_OPTIONS_TOKEN,
} from './redis.constants';
import { RedisHealthIndicator } from './redis.health-indicator';
import Redis from 'ioredis';

@Global()
@Module({})
export class RedisModule {
    public static forRootAsync(
        options: RedisModuleAsyncOptions,
    ): DynamicModule {
        const redisConnectionProvider: Provider = {
            provide: REDIS_MODULE_CONNECTION_TOKEN,
            useFactory: (redisUrl: string) => {
                return new Redis(redisUrl);
            },
            inject: [REDIS_MODULE_OPTIONS_TOKEN],
        };

        return {
            module: RedisModule,
            imports: options.imports,
            providers: [
                ...this.createAsyncProviders(options),
                redisConnectionProvider,
                RedisHealthIndicator,
            ],
            exports: [redisConnectionProvider, RedisHealthIndicator],
        };
    }

    public static createAsyncProviders(
        options: RedisModuleAsyncOptions,
    ): Provider[] {
        return [
            {
                provide: REDIS_MODULE_OPTIONS_TOKEN,
                useFactory: options.useFactory,
                inject: options.inject || [],
            },
        ];
    }
}
