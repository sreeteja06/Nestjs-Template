/* eslint-disable @typescript-eslint/ban-types */
import {
    createParamDecorator,
    ExecutionContext,
    SetMetadata,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { Scope } from '../common/enums/scope.enum';
import { ScopesGuard } from '../guards/scope.guard';
import { RequestWithUserInfo } from '../common/interface/request';
import { M2MGuard } from '../guards/m2m.guard';

export const SCOPES_KEY = 'scopes';

/**
 * JWT Guard Decorator with scope.
 * @param scopes
 * @returns JWTUser payload attached to request.
 */
export const Auth = (...scopes: Scope[]): MethodDecorator => {
    return (
        target: Function,
        key: string | symbol,
        descriptor: TypedPropertyDescriptor<unknown>,
    ): void => {
        SetMetadata(SCOPES_KEY, scopes)(target, key, descriptor);
        ApiBearerAuth()(target, key, descriptor);
        UseGuards(ScopesGuard)(target, key, descriptor);
    };
};

/**
 * M2M Guard Decorator, checks x-token header and ip address.
 * @returns
 */
export const M2MAuth = (): MethodDecorator => {
    return (
        target: Function,
        key: string | symbol,
        descriptor: TypedPropertyDescriptor<unknown>,
    ): void => {
        ApiHeader({ name: 'x-token', required: true })(target, key, descriptor);
        UseGuards(M2MGuard)(target, key, descriptor);
    };
};

/**
 * Param decorator, Extracts user/user key value from the request
 * @param JWTUser Key
 * @returns JWTUser or value of JWTUser key
 */
export const ReqUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request: RequestWithUserInfo = ctx.switchToHttp().getRequest();
        const { user } = request;
        return data ? user && user[data] : user;
    },
);
