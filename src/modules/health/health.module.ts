import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { RedisModule } from '../redis';

@Module({
    imports: [TerminusModule, RedisModule],
    controllers: [HealthController],
})
export class HealthModule {}
