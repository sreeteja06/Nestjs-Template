import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { CONFIG_KEYS } from '../../../constants/system.constant';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly _configService: ConfigService,
        private readonly _reflector: Reflector,
    ) {
        super({
            secretOrKeyProvider: passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: `${_configService.get(
                    CONFIG_KEYS.AUTH0_DOMAIN,
                )}/.well-known/jwks.json`,
            }),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            audience: _configService.get(CONFIG_KEYS.AUTH0_AUDIENCE),
            issuer: [
                `${_configService.get(CONFIG_KEYS.AUTH0_DOMAIN)}/`,
                `${_configService.get(CONFIG_KEYS.AUTH0_TENANT_DOMAIN)}/`,
            ],
            algorithm: 'RS256',
        });
    }

    // eslint-disable-next-line class-methods-use-this
    validate(payload: JWTUser): JWTUser {
        payload.sub = payload.sub.split('|').pop();
        return payload;
    }
}
