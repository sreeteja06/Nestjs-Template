import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';
import { extractIp } from '../decorators/ip.decorator';
import { isRabbitContext } from '@golevelup/nestjs-rabbitmq';

// Throttler guard, throws too many requests exception on defend constraints.
@Injectable()
export class ProxyIpThrottlerGuard extends ThrottlerGuard {
    async handleRequest(
        context: ExecutionContext,
        limit: number,
        ttl: number,
    ): Promise<boolean> {
        if (isRabbitContext(context)) {
            return true;
        }

        const req: Request = context.switchToHttp().getRequest();
        const ip = extractIp(req);
        const key = this.generateKey(context, ip);
        const ttls = await this.storageService.getRecord(key);

        if (ttls.length >= limit) {
            throw new ThrottlerException();
        }

        await this.storageService.addRecord(key, ttl);
        return true;
    }
}
