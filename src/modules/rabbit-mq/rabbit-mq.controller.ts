import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { RABBITMQ_ROUTING_KEYS } from '../../constants/rabbitmq.constant';
import { RabbitMqService } from './rabbit-mq.service';

@ApiTags('rabbit-mq')
@Controller('rabbit-mq')
export class RabbitMqController {
    constructor(private readonly _rabbitMqService: RabbitMqService) {}

    @ApiOperation({
        summary: 'Send message to RabbitMQ',
        description: 'Send message to RabbitMQ',
    })
    @ApiParam({
        name: 'routingKey',
        description: 'Routing key',
        required: true,
        enum: ['subscribe.route'],
    })
    @ApiBody({
        description: 'Message',
        required: true,
        type: Object,
    })
    @Post('/publish/:routingKey')
    async publishMessage(
        @Param('routingKey') route: RABBITMQ_ROUTING_KEYS,
        @Body() payload: unknown,
    ): Promise<any> {
        await this._rabbitMqService.publishMessage(route, payload);
        return 'Message sent';
    }
}
