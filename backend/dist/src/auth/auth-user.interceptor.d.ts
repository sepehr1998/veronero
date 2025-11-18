import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../users/users.service';
export declare class AuthUserSyncInterceptor implements NestInterceptor {
    private readonly usersService;
    constructor(usersService: UsersService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown>;
}
