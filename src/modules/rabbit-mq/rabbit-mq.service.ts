import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqplib from 'amqplib';
import {
    RABBITMQ_EXCHANGE_NAME,
    RABBITMQ_ROUTING_KEYS,
} from '../../constants/rabbitmq.constant';
import { CONFIG_KEYS } from '../../constants/system.constant';

@Injectable()
export class RabbitMqService {
    private readonly logger = new Logger(RabbitMqService.name);

    constructor(
        private readonly _amqpConnection: AmqpConnection,
        private readonly _configService: ConfigService,
    ) {}

    // @RabbitSubscribe({
    //     exchange: RABBITMQ_EXCHANGE_NAME,
    //     routingKey: RABBITMQ_ROUTING_KEYS.SUBSCRIBE_ROUTE,
    //     queue: RABBITMQ_QUEUES.SUBSCRIBE_QUEUE,
    // })
    // async testPubSub(data: unknown): Promise<void> {
    //     this.logger.log(`Received Message: ${JSON.stringify(data)}`);
    // }

    async publishMessage(
        routingKey: RABBITMQ_ROUTING_KEYS,
        payload: unknown,
        exchange = RABBITMQ_EXCHANGE_NAME,
    ): Promise<void> {
        const conn = await amqplib.connect(
            this._configService.get(
                CONFIG_KEYS.RABBITMQ_URI,
                'amqp://localhost',
            ),
        );

        const channel = await conn.createConfirmChannel();
        // await channel.assertExchange(exchange, 'direct', { durable: true });
        await new Promise((resolve, reject) => {
            channel.publish(
                exchange,
                routingKey,
                Buffer.from(JSON.stringify(payload)),
                {},
                (err, ok) => {
                    if (err) {
                        this.logger.error(err);
                        reject(err);
                    }
                    console.log('ok', ok);
                    resolve(ok);
                },
            );
        });
    }
}
