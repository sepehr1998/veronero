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
        if (err) {
            if (err instanceof Error) {
                throw err;
            }
            throw new UnauthorizedException('Invalid authentication token');
        }

        const authUser = user as unknown as Auth0JwtPayload | undefined;
        if (!authUser) {
            throw new UnauthorizedException('Invalid authentication token');
        }

        const request = context
            .switchToHttp()
            .getRequest<AuthenticatedRequest>();
        request.user = authUser;

        return user;
    }
}
