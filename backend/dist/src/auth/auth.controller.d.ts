import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import type { AuthSession } from './auth.types';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(res: Response, returnTo?: string, prompt?: string): Promise<void>;
    logout(res: Response, returnTo?: string): Promise<void>;
    callback(res: Response): Promise<void>;
    callbackPost(res: Response): Promise<void>;
    getSession(req: Request): Promise<AuthSession>;
}
