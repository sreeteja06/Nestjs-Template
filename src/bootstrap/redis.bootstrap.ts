import { RedisModuleAsyncOptions } from '../modules/redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CONFIG_KEYS } from '../constants/system.constant';

const redisBootstrap: RedisModuleAsyncOptions = {
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) =>
        configService.get(CONFIG_KEYS.REDIS_URL),
    inject: [ConfigService],
};

export default redisBootstrap;
