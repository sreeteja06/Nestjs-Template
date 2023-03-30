import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import RabbitmqBootstrap from '../../bootstrap/rabbitmq.bootstrap';
import { RabbitMqController } from './rabbit-mq.controller';
import { RabbitMqService } from './rabbit-mq.service';

@Module({
    imports: [RabbitMQModule.forRootAsync(RabbitMQModule, RabbitmqBootstrap)],
    providers: [RabbitMqService],
    controllers: [RabbitMqController],
})
export class RabbitMqModule {}
