import { ConfigModuleOptions } from '@nestjs/config';
import * as Joi from 'joi';
import {
    SENTRY_DEFAULT_SAMPLE_RATE,
    SENTRY_DEFAULT_TRACE_SAMPLE_RATE,
} from '../constants/system.constant';
import { LogLevels } from '../common/enums/log-levels.enum';

const configBootStrap: ConfigModuleOptions = {
    validationSchema: Joi.object({
        NODE_ENV: Joi.string().required(),
        PORT: Joi.number().positive(),
        // database env
        TYPEORM_HOST: Joi.string().required(),
        TYPEORM_USERNAME: Joi.string().required(),
        TYPEORM_PASSWORD: Joi.string(),
        TYPEORM_DATABASE: Joi.string().required(),
        TYPEORM_PORT: Joi.number().required(),
        TYPEORM_LOGGING: Joi.boolean().default(false),
        TYPEORM_DDL_SYNC: Joi.boolean().default(false),
        // swagger
        WITH_DOCS: Joi.boolean().default(false),
        SWAGGER_USER: Joi.string().required(),
        SWAGGER_PASSWORD: Joi.string().required(),
        // Auth0
        AUTH0_DOMAIN: Joi.string().required(),
        AUTH0_TENANT_DOMAIN: Joi.string().required(),
        AUTH0_AUDIENCE: Joi.string().required(),
        // Machine 2 Machine Keys
        MACHINE_TOKEN: Joi.string(),
        MACHINE_IPS: Joi.string(),
        // cors
        CORS_WHITELIST: Joi.string(),
        // sentry logging
        SENTRY_DSN: Joi.string(),
        SENTRY_LOGGING: Joi.string(),
        SENTRY_SAMPLE_RATE: Joi.number().default(SENTRY_DEFAULT_SAMPLE_RATE),
        SENTRY_TRACES_SAMPLE_RATE: Joi.number().default(
            SENTRY_DEFAULT_TRACE_SAMPLE_RATE,
        ),
        // rabbitmq
        RABBITMQ_URI: Joi.string().required(),

        OTLP_COLLECTOR_URL: Joi.string().optional(),

        REDIS_URL: Joi.string().required(),

        LOG_LEVEL: Joi.string()
            .valid(...Object.values(LogLevels))
            .default(LogLevels.INFO),
    }).options({ convert: true, allowUnknown: true }),

    validationOptions: {
        allowUnknown: false,
        abortEarly: true,
    },

    isGlobal: true,
};

export default configBootStrap;
