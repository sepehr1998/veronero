import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { UsersService } from '../users/users.service';
import type { AuthSession } from './auth.types';
interface LoginOptions {
    returnTo?: string;
    prompt?: 'login' | 'none';
}
export declare class AuthService {
    private readonly configService;
    private readonly usersService;
    private readonly baseUrl;
    private readonly callbackUrl;
    private readonly baseOrigin;
    private readonly audience;
    private readonly defaultScope;
    private readonly allowedReturnOrigins;
    constructor(configService: ConfigService, usersService: UsersService);
    login(res: Response, options?: LoginOptions): Promise<void>;
    logout(res: Response, returnTo?: string): Promise<void>;
    handleCallback(res: Response): Promise<void>;
    getSession(req: Request): Promise<AuthSession>;
    private normalizeReturnPath;
    private mapUser;
    private mapAuth0Profile;
    private extractOptionalString;
}
export {};
