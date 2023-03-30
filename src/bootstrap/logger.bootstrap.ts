/* eslint-disable no-magic-numbers */
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CONFIG_KEYS } from '../constants/system.constant';
import { LogLevels } from '../common/enums/log-levels.enum';
import { LoggerModuleAsyncParams } from 'nestjs-pino';
import { RequestMethod } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';
import transport from '../shared/pino/pino.transport';

const loggerBootstrap: LoggerModuleAsyncParams = {
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
        pinoHttp: [
            {
                level:
                    configService.get<string>(CONFIG_KEYS.LOG_LEVEL) ||
                    LogLevels.INFO,
                redact: ['req.headers.authorization'],
                quietReqLogger: true,
                genReqId: (req): string => {
                    if (req.headers.traceparent) {
                        if (typeof req.headers.traceparent === 'string') {
                            const [, traceId] =
                                req.headers.traceparent.split('-');
                            if (traceId) {
                                return traceId;
                            }
                        } else if (Array.isArray(req.headers.traceparent)) {
                            const [, traceId] =
                                req.headers.traceparent[0].split('-');
                            if (traceId) {
                                return traceId;
                            }
                        }
                    }
                    if (req.headers['x-request-id']) {
                        if (typeof req.headers['x-request-id'] === 'string') {
                            return req.headers['x-request-id'];
                        } else if (Array.isArray(req.headers['x-request-id'])) {
                            return req.headers['x-request-id'][0];
                        }
                    }
                    return uuidV4();
                },
                formatters: {
                    level: (label: string): { level: string } => {
                        return { level: label };
                    },
                },
            },
            transport({}),
        ],
        exclude: [{ method: RequestMethod.GET, path: 'api/healthz' }],
    }),
    inject: [ConfigService],
};

export default loggerBootstrap;
