import { Request } from 'express';
import {
    ExecutionContext,
    Inject,
    Injectable,
    Logger,
    LoggerService,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { extractIp } from '../decorators/ip.decorator';
import { CONFIG_KEYS } from '../constants/system.constant';

// Machine to machine guard, currently checks header and verifies IP address
@Injectable()
export class M2MGuard {
    constructor(
        private readonly _configService: ConfigService,
        @Inject(Logger) private readonly _logger: LoggerService,
    ) {}

    public canActivate(context: ExecutionContext): boolean {
        const req: Request = context.switchToHttp().getRequest();

        const token = req.headers['x-token'];
        const ip = extractIp(req);

        if (this._configService.get(CONFIG_KEYS.MACHINE_TOKEN) !== token) {
            this._logger.warn(
                `Trying to access with incorrect token :: ${token}, ip: ${ip}`,
            );
            return false;
        }

        const adminIPs = this._configService.get(CONFIG_KEYS.MACHINE_IPS);
        if (adminIPs.includes(ip)) {
            return true;
        }

        this._logger.warn(`Trying to access from unauthorized IP :: ${ip}`);
        return false;
    }
}
