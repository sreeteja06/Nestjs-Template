import { Controller, Get, Post, Query, Version } from '@nestjs/common';
import { AppService } from './app.service';
import { Auth, M2MAuth } from './decorators/auth.decorator';
import { Scope } from './common/enums/scope.enum';
import { PinoLogger } from 'nestjs-pino';
import { LogLevels } from './common/enums/log-levels.enum';
import { ApiQuery } from '@nestjs/swagger';

@Controller({
    version: '1',
})
export class AppController {
    constructor(private readonly _appService: AppService) {}

    @Get()
    public getHello(): string {
        return this._appService.getHello();
    }

    @Auth(Scope.IS_ADMIN_FOR_APP)
    @Post('change-log-level')
    @ApiQuery({ name: 'logLevel', required: true, enum: LogLevels })
    // eslint-disable-next-line class-methods-use-this
    public changeLogLevel(@Query('logLevel') logLevel: LogLevels): string {
        PinoLogger.root.level = logLevel;
        return 'ok';
    }

    @Auth(Scope.IS_ADMIN_FOR_APP)
    @Get('/test/logging')
    public async testLogging(): Promise<string> {
        await this._appService.testLogging();
        return 'ok';
    }

    @Auth()
    @Get('example/authenticated')
    public getAuthenticatedRoute(): string {
        return this._appService.getHello();
    }

    @Version('2')
    @Auth(Scope.ADMIN)
    @Get('example/auth-with-one-scope')
    public getAuthRouteWithOneScope(): string {
        return this._appService.getHello();
    }

    @Auth(Scope.ADMIN, Scope.READ_ONLY)
    @Get('example/auth-with-multi-scope')
    public getAuthRouteWithMultiScope(): string {
        return this._appService.getHello();
    }

    @M2MAuth()
    @Get('example/machine-auth')
    public getMachineAuth(): string {
        return this._appService.getHello();
    }
}
