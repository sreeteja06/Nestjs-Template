/* eslint-disable @typescript-eslint/no-explicit-any*/
import { ModuleMetadata } from '@nestjs/common/interfaces';
import * as IORedis from 'ioredis';

export type Redis = IORedis.Redis;

export interface RedisModuleAsyncOptions
    extends Pick<ModuleMetadata, 'imports'> {
    inject?: any[];
    useFactory: (
        ...args: any[]
    ) => Promise<IORedis.RedisOptions> | IORedis.RedisOptions;
}
