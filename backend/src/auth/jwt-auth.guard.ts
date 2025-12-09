import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Auth0JwtPayload, AuthenticatedRequest } from './auth.types';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest<TUser = Auth0JwtPayload>(
        err: unknown,
        user: TUser,
        info: unknown,
        context: ExecutionContext,
    ): TUser {
        const request = context
            .switchToHttp()
            .getRequest<AuthenticatedRequest>();

        if (user) {
            request.user = user as unknown as Auth0JwtPayload;
            return user;
        }

        // Fallback to session (express-openid-connect) if JWT is missing
        const oidcUser =
            (request as any)?.oidc?.user as Auth0JwtPayload | undefined;
        const isAuthenticated = Boolean(
            (request as any)?.oidc?.isAuthenticated?.(),
        );

        if (isAuthenticated && oidcUser?.sub) {
            request.user = oidcUser;
            return oidcUser as unknown as TUser;
        }

        if (err) {
            if (err instanceof Error) {
                throw err;
            }
            throw new UnauthorizedException('Invalid authentication token');
        }

        throw new UnauthorizedException('Invalid authentication token');
    }
}
