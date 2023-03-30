import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { CaptureConsole } from '@sentry/integrations';
import {
    CONFIG_KEYS,
    SENTRY_DEFAULT_SAMPLE_RATE,
    SENTRY_DEFAULT_TRACE_SAMPLE_RATE,
} from '../constants/system.constant';

const sentryInitializeBootstrap = (configService: ConfigService): void => {
    Sentry.init({
        dsn: configService.get(CONFIG_KEYS.SENTRY_DSN),
        debug: false,
        integrations: [
            new CaptureConsole({ levels: ['error', 'warn'] }),
            new Tracing.Integrations.Mysql(),
        ],
        sampleRate:
            configService.get(CONFIG_KEYS.SENTRY_SAMPLE_RATE) ||
            SENTRY_DEFAULT_SAMPLE_RATE,
        tracesSampleRate:
            configService.get(CONFIG_KEYS.SENTRY_TRACES_SAMPLE_RATE) ||
            SENTRY_DEFAULT_TRACE_SAMPLE_RATE,
        environment: configService.get(CONFIG_KEYS.NODE_ENV) || 'production',
        beforeSend(event) {
            // if SENTRY_LOGGING equal false Sentry.io not logging
            if (configService.get(CONFIG_KEYS.SENTRY_LOGGING) === 'true') {
                return event;
            } else {
                return null;
            }
        },
        maxBreadcrumbs: 50,
    });
};

export default sentryInitializeBootstrap;
