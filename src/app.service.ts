import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from './shared/http/http.service';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { CONFIG_KEYS } from './constants/system.constant';

@Injectable()
export class AppService {
    private readonly _logger: Logger = new Logger(AppService.name);
    private readonly hello = 'Hello World';

    constructor(
        private readonly _httpService: HttpService,
        private readonly _configService: ConfigService,
    ) {}

    public getHello(): string {
        return this.hello;
    }

    public async testLogging(): Promise<void> {
        await lastValueFrom(
            this._httpService.get(
                `http://localhost:${this._configService.get(
                    CONFIG_KEYS.PORT,
                )}/api/v1`,
            ),
        ).catch(() => {
            return undefined;
        });
        await lastValueFrom(
            this._httpService.get(
                `http://localhost:${this._configService.get(
                    CONFIG_KEYS.PORT,
                )}/api/v0`,
            ),
        ).catch(() => {
            return undefined;
        });
        this._logger.warn(this.hello);
        this._logger.debug(this.hello);
        this._logger.verbose(this.hello);
        this._logger.log(this.hello);
        this._logger.error(new Error('Test Logging'));
    }
}
