import {
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { SCOPES_KEY } from '../decorators/auth.decorator';
import { RequestWithUserInfo } from '../common/interface/request';
import { Scope } from '../common/enums/scope.enum';
import { PinoLogger } from 'nestjs-pino';

// extends default passport jwt authGuard and adds the option to check scope accessibility for a token
// throws forbidden exception if the token does not have the specified scope/s.
@Injectable()
export class ScopesGuard extends AuthGuard('jwt') {
    // private readonly _logger = new Logger(ScopesGuard.name);

    constructor(
        private readonly _reflector: Reflector,
        private readonly _logger: PinoLogger,
    ) {
        super();
        this._logger.setContext(ScopesGuard.name);
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const authenticated = await super.canActivate(context);

        if (!authenticated) {
            return false;
        }

        const req: RequestWithUserInfo = context.switchToHttp().getRequest();

        let requiredScopes = this._reflector.getAllAndOverride<string[]>(
            SCOPES_KEY,
            [context.getHandler(), context.getClass()],
        );

        // if IS_ADMIN_FOR_APP is in the scope, verify and then remove the scope
        // so that will not conflict with the actual auth0 scopes
        if (requiredScopes.includes(Scope.IS_ADMIN_FOR_APP)) {
            if (!req.user[`${req.user.aud[0]}app_metadata`]?.isAdmin) {
                this._logger.warn(
                    `JWT of sub ${req.user.sub} is not an app admin in app_metadata details`,
                );
                throw new ForbiddenException();
            } else {
                requiredScopes = requiredScopes.filter(
                    (item) => item !== Scope.IS_ADMIN_FOR_APP,
                );
            }
        }

        if (!requiredScopes || requiredScopes.length <= 0) {
            this._logger.assign({ userId: req.user.sub });
            return true;
        }

        if (
            !requiredScopes.some((s) => req.user.scope?.split(' ')?.includes(s))
        ) {
            this._logger.warn(
                `JWT of sub ${
                    req.user.sub
                } does not possess one of the required scopes (${requiredScopes.join(
                    ',',
                )})`,
            );
            throw new ForbiddenException();
        }

        return true;
    }
}
