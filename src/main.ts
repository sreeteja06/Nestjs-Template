import {
    Logger as NestJsLogger,
    ValidationPipe,
    VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import corsBootstrap from './bootstrap/cors.bootstrap';
import { otlpCollector } from './bootstrap/otlp.bootstrap';
import sentryInitializeBootstrap from './bootstrap/sentry.bootstrap';
import swaggerBootstrap from './bootstrap/swagger.bootstrap';
import { CONFIG_KEYS } from './constants/system.constant';
import { ErrorFilter } from './filters/error.filter';
import { NotFoundInterceptor } from './interceptors/not_found.interceptor';

async function bootstrap(): Promise<void> {
    const configService = new ConfigService();
    await otlpCollector('Template Service', configService);

    sentryInitializeBootstrap(configService);

    const app = await NestFactory.create(AppModule, {
        bufferLogs: true,
    });

    app.enableCors(corsBootstrap(configService));

    app.setGlobalPrefix('api');

    app.useLogger(app.get(Logger));

    app.use(helmet());

    // global settings
    app.enableVersioning({
        type: VersioningType.URI,
    });

    app.useGlobalFilters(new ErrorFilter(configService));

    app.useGlobalInterceptors(new NotFoundInterceptor());

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    swaggerBootstrap(app, configService);

    await app.listen(configService.get(CONFIG_KEYS.PORT));
    NestJsLogger.log(
        `Swagger Docs available at http://localhost:${configService.get(
            CONFIG_KEYS.PORT,
        )}/api-docs`,
    );
}

bootstrap().catch((error) => {
    NestJsLogger.error(error);
    process.exit(1);
});
