import { ExecutionContext } from '@nestjs/common';
import { Auth0JwtPayload } from './auth.types';
declare const JwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtAuthGuard extends JwtAuthGuard_base {
    handleRequest<TUser = Auth0JwtPayload>(err: unknown, user: TUser, info: unknown, context: ExecutionContext): TUser;
}
export {};
