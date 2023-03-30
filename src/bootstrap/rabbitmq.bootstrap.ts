import { ConfigModule, ConfigService } from '@nestjs/config';
import { AsyncModuleConfig } from '@golevelup/nestjs-modules/lib/dynamicModules';
import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';
import { CONFIG_KEYS } from '../constants/system.constant';
import {
    RABBITMQ_EXCHANGE_NAME,
    RABBITMQ_EXCHANGE_TYPE,
} from '../constants/rabbitmq.constant';

const RabbitmqBootstrap: AsyncModuleConfig<RabbitMQConfig> = {
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
        uri: configService.get(CONFIG_KEYS.RABBITMQ_URI),
        exchanges: [
            {
                name: RABBITMQ_EXCHANGE_NAME,
                type: RABBITMQ_EXCHANGE_TYPE,
            },
        ],
    }),
    inject: [ConfigService],
};

export default RabbitmqBootstrap;
