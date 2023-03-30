import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as basicAuth from 'express-basic-auth';
import { CONFIG_KEYS } from '../constants/system.constant';
import * as packageJson from '../../package.json';

const swaggerBootstrap = (
    app: INestApplication,
    configService: ConfigService,
): void => {
    app.use(
        ['/api-docs', '/api-docs-json'],
        basicAuth({
            challenge: true,
            users: {
                [configService.get(CONFIG_KEYS.SWAGGER_USER)]:
                    configService.get(CONFIG_KEYS.SWAGGER_PASSWORD),
            },
        }),
    );

    if (String(configService.get(CONFIG_KEYS.WITH_DOCS)) === 'true') {
        const options = new DocumentBuilder()
            .setTitle(String(packageJson.name))
            .setDescription(String(packageJson.description))
            .setVersion(String(packageJson.version))
            .addBearerAuth()
            .build();
        const document = SwaggerModule.createDocument(app, options);
        SwaggerModule.setup('api-docs', app, document);
    }
};

export default swaggerBootstrap;
