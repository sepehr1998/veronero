import {
    Controller,
    Get,
    Post,
    Query,
    Req,
    Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import type { AuthSession } from './auth.types';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('login')
    login(
        @Res() res: Response,
        @Query('returnTo') returnTo?: string,
        @Query('prompt') prompt?: string,
    ): Promise<void> {
        return this.authService.login(res, {
            returnTo,
            prompt: prompt as 'login' | 'none' | undefined,
        });
    }

    @Get('logout')
    logout(
        @Res() res: Response,
        @Query('returnTo') returnTo?: string,
    ): Promise<void> {
        return this.authService.logout(res, returnTo);
    }

    @Get('callback')
    callback(@Res() res: Response): Promise<void> {
        return this.authService.handleCallback(res);
    }

    @Post('callback')
    callbackPost(@Res() res: Response): Promise<void> {
        return this.authService.handleCallback(res);
    }

    @Get('session')
    getSession(@Req() req: Request): Promise<AuthSession> {
        return this.authService.getSession(req);
    }
}
