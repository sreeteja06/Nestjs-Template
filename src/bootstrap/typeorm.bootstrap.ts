import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { CONFIG_KEYS } from '../constants/system.constant';
import TypeormLogger from '../shared/typeorm/logger/typeorm.logger';

const typeormBootstrap: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get(CONFIG_KEYS.TYPEORM_HOST),
        port: Number(configService.get<number>(CONFIG_KEYS.TYPEORM_PORT)),
        username: configService.get(CONFIG_KEYS.TYPEORM_USERNAME),
        password: configService.get(CONFIG_KEYS.TYPEORM_PASSWORD),
        database: configService.get(CONFIG_KEYS.TYPEORM_DATABASE),
        entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
        synchronize:
            configService.get(CONFIG_KEYS.NODE_ENV) !== 'production' &&
            String(configService.get(CONFIG_KEYS.TYPEORM_DDL_SYNC)) === 'true',
        maxQueryExecutionTime: 1000,
        logger: new TypeormLogger(
            String(configService.get(CONFIG_KEYS.TYPEORM_LOGGING)) === 'true',
        ),
    }),
    inject: [ConfigService],
};

export default typeormBootstrap;
