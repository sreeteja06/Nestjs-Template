import { Inject } from '@nestjs/common';
import { REDIS_MODULE_CONNECTION_TOKEN } from './redis.constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const InjectRedis = (): any => {
    return Inject(REDIS_MODULE_CONNECTION_TOKEN);
};
