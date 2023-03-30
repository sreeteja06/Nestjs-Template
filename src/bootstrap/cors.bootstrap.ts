import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { CONFIG_KEYS } from '../constants/system.constant';

const corsBootstrap = (configService: ConfigService): CorsOptions => {
    return {
        origin: (
            origin: unknown,
            callback: (err: Error | null, allowed?: boolean) => void,
        ): unknown => {
            if (
                origin === undefined ||
                configService
                    .get(CONFIG_KEYS.CORS_WHITELIST)
                    .indexOf(origin) !== -1 ||
                configService.get(CONFIG_KEYS.WITH_DOCS) === 'true'
            ) {
                return callback(null, true);
            } else {
                return callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    };
};

export default corsBootstrap;
