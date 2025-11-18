import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UsersService } from '../users/users.service';
import type { Auth0JwtPayload, AuthenticatedRequest } from './auth.types';

type RequestWithAuthContext = AuthenticatedRequest & {
    user?: Auth0JwtPayload;
};

@Injectable()
export class AuthUserSyncInterceptor implements NestInterceptor {
    constructor(private readonly usersService: UsersService) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<unknown> {
        const request = context
            .switchToHttp()
            .getRequest<RequestWithAuthContext>();
        const payload = request?.user;

        if (!payload?.sub) {
            return next.handle();
        }

        return from(
            this.usersService.syncFromAuth0Payload(payload).then((user) => {
                request.authUser = user;
                return user;
            }),
        ).pipe(switchMap(() => next.handle()));
    }
}
