const RABBITMQ_EXCHANGE_NAME = 'template.tx';
const RABBITMQ_EXCHANGE_TYPE = 'topic';
const enum RABBITMQ_ROUTING_KEYS {
    SUBSCRIBE_ROUTE = 'subscribe.route',
}

const enum RABBITMQ_QUEUES {
    SUBSCRIBE_QUEUE = 'subscribe-queue',
}

export {
    RABBITMQ_EXCHANGE_NAME,
    RABBITMQ_EXCHANGE_TYPE,
    RABBITMQ_QUEUES,
    RABBITMQ_ROUTING_KEYS,
};
