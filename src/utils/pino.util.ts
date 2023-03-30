import { storage } from 'nestjs-pino/storage';

export const getReqIdFromPino = (): string => {
    const logger = storage.getStore()?.logger;
    if (logger) {
        return logger.bindings?.()?.reqId;
    }
};
