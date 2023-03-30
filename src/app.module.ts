import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configBootStrap from './bootstrap/config.bootstrap';
import typeormBootstrap from './bootstrap/typeorm.bootstrap';
import {
    THROTTLER_NUMBER_OF_REQUESTS,
    THROTTLER_WINDOW_PERIOD,
} from './constants/system.constant';
import { ProxyIpThrottlerGuard } from './guards/proxy-ip-throttler.guard';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { UserModule } from './modules/user/user.module';
import { RabbitMqModule } from './modules/rabbit-mq/rabbit-mq.module';
import { LoggerModule } from 'nestjs-pino';
import loggerBootstrap from './bootstrap/logger.bootstrap';
import { RedisModule } from './modules/redis';
import redisBootstrap from './bootstrap/redis.bootstrap';
import { HttpService } from './shared/http/http.service';

@Module({
    imports: [
        ConfigModule.forRoot(configBootStrap),
        TypeOrmModule.forRootAsync(typeormBootstrap),
        LoggerModule.forRootAsync(loggerBootstrap),
        ThrottlerModule.forRoot({
            ttl: THROTTLER_WINDOW_PERIOD,
            limit: THROTTLER_NUMBER_OF_REQUESTS,
        }),
        RabbitMqModule,
        RedisModule.forRootAsync(redisBootstrap),
        LoggerModule.forRootAsync(loggerBootstrap),

        // project modules
        AuthModule,
        HealthModule,
        UserModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        Logger,
        HttpService,
        {
            provide: APP_GUARD,
            useClass: ProxyIpThrottlerGuard,
        },
    ],
})
export class AppModule {}
