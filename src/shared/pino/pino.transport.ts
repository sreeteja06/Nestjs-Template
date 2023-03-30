/* eslint-disable @typescript-eslint/no-var-requires */

import { LogLevels } from '../../common/enums/log-levels.enum';
import { withScope } from '@sentry/node';

const { Transform } = require('readable-stream');
const abstractTransport = require('pino-abstract-transport');
const sonic = require('sonic-boom');
const pump = require('pump');
const sjs = require('secure-json-parse');
const sentry = require('@sentry/node');

const jsonParser = (input): { value?: any; err?: Error } => {
    try {
        return { value: sjs.parse(input, { protoAction: 'remove' }) };
    } catch (err) {
        return { err };
    }
};

const isObject = (input): boolean =>
    Object.prototype.toString.apply(input) === '[object Object]';

const Color = {
    Reset: '\x1b[0m',
    Bright: '\x1b[1m',
    Dim: '\x1b[2m',
    Underscore: '\x1b[4m',
    Blink: '\x1b[5m',
    Reverse: '\x1b[7m',
    Hidden: '\x1b[8m',

    FgBlack: '\x1b[30m',
    FgRed: '\x1b[31m',
    FgGreen: '\x1b[32m',
    FgYellow: '\x1b[33m',
    FgBlue: '\x1b[34m',
    FgMagenta: '\x1b[35m',
    FgCyan: '\x1b[36m',
    FgWhite: '\x1b[37m',

    BgBlack: '\x1b[40m',
    BgRed: '\x1b[41m',
    BgGreen: '\x1b[42m',
    BgYellow: '\x1b[43m',
    BgBlue: '\x1b[44m',
    BgMagenta: '\x1b[45m',
    BgCyan: '\x1b[46m',
    BgWhite: '\x1b[47m',
};

const colorString = (color, data): string => {
    return `${color}${data}${Color.Reset}\n`;
};

const applyColor = (level: string, data: string): string => {
    switch (level) {
        case LogLevels.FATAL:
        case LogLevels.ERROR:
            return colorString(Color.FgRed, data);
        case LogLevels.WARN:
            return colorString(Color.FgYellow, data);
        case LogLevels.INFO:
            return colorString(Color.FgGreen, data);
        case LogLevels.DEBUG:
            return colorString(Color.FgCyan, data);
        case LogLevels.TRACE:
            return colorString(Color.FgMagenta, data);
        default:
            return data;
    }
};

const transformLog = (input: string): string => {
    let level: LogLevels = undefined;
    if (!isObject(input)) {
        const parsed = jsonParser(input);
        if (parsed.err || !isObject(parsed.value)) {
            // pass through
            level = LogLevels.INFO;
        }
        level = parsed.value?.level ?? LogLevels.INFO;
        if (level === LogLevels.ERROR || level === LogLevels.FATAL) {
            let e = undefined;

            if (parsed.value?.err) {
                e = new Error();
                e.stack = parsed.value?.err?.stack;
                e.message = parsed.value?.err?.message;
            } else if (parsed.value?.error) {
                e = new Error();
                e.stack = parsed.value?.error?.stack;
                e.message = parsed.value?.error;
            } else {
                e = new Error(parsed.value);
            }

            withScope((scope) => {
                scope.setExtra('extraData', parsed.value);
                if (parsed.value?.reqId) {
                    scope.setTag('reqId', parsed.value?.reqId);
                }
                if (parsed.value?.userId) {
                    scope.setUser({ id: parsed.value?.userId });
                }
                if (parsed.value?.err?.sql || parsed.value?.error?.sql) {
                    const type = parsed.value?.error?.sql ? 'raw-sql' : 'sql';
                    scope.setTag(type, true);
                    scope.addBreadcrumb({
                        type,
                        level: 'error',
                        message:
                            type === 'sql'
                                ? parsed.value?.err?.message
                                : parsed.value?.error?.sqlMessage,
                        category:
                            type === 'sql'
                                ? parsed.value?.err?.code
                                : parsed.value?.error?.code,
                        data: {},
                    });
                }
                sentry.captureException(e);
            });
        }
    } else {
        level = LogLevels.INFO;
    }
    return applyColor(level, input);
};

export default function (options: unknown): any {
    return abstractTransport(
        function (source) {
            const stream = new Transform({
                objectMode: true,
                autoDestroy: true,
                transform(chunk, enc, cb): void {
                    const line = transformLog(chunk);
                    cb(null, line);
                },
            });

            const destination = sonic({
                dest: 1,
            });

            source.on('unknown', function (line) {
                destination.write(`${line}\n`);
            });

            pump(source, stream, destination);
            return stream;
        },
        { parse: 'lines' },
    );
}
