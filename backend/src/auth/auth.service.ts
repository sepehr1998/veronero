import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { User } from '@prisma/client';
import type { Request, Response } from 'express';
import { UsersService } from '../users/users.service';
import type {
    Auth0JwtPayload,
    AuthSession,
    AuthenticatedUserProfile,
    Auth0Profile,
} from './auth.types';

interface LoginOptions {
    returnTo?: string;
    prompt?: 'login' | 'none';
}

@Injectable()
export class AuthService {
    private readonly baseUrl: string;
    private readonly callbackUrl: string;
    private readonly baseOrigin: string;
    private readonly audience: string;
    private readonly defaultScope = 'openid profile email';
    private readonly allowedReturnOrigins: Set<string>;

    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
    ) {
        this.baseUrl = this.configService.getOrThrow<string>('auth.baseUrl');
        this.baseOrigin = new URL(this.baseUrl).origin;
        this.callbackUrl = new URL('/auth/callback', this.baseUrl).toString();
        this.audience = this.configService.getOrThrow<string>('auth.audience');
        const configuredOrigins =
            this.configService.get<string[]>('auth.allowedReturnOrigins') ?? [];
        this.allowedReturnOrigins = new Set(
            configuredOrigins
                .map((origin) => {
                    try {
                        return new URL(origin).origin;
                    } catch {
                        return null;
                    }
                })
                .filter((value): value is string => Boolean(value)),
        );
    }

    async login(res: Response, options?: LoginOptions): Promise<void> {
        await res.oidc.login({
            returnTo: this.normalizeReturnPath(options?.returnTo),
            authorizationParams: {
                redirect_uri: this.callbackUrl,
                scope: this.defaultScope,
                audience: this.audience,
                ...(options?.prompt ? { prompt: options.prompt } : null),
            },
        });
    }

    async logout(res: Response, returnTo?: string): Promise<void> {
        await res.oidc.logout({
            returnTo: this.normalizeReturnPath(returnTo),
        });
    }

    async handleCallback(res: Response): Promise<void> {
        await res.oidc.callback({
            redirectUri: this.callbackUrl,
        });
    }

    async getSession(req: Request): Promise<AuthSession> {
        const isAuthenticated = req.oidc?.isAuthenticated?.() ?? false;
        if (!isAuthenticated || !req.oidc.user) {
            return {
                isAuthenticated: false,
                user: null,
                auth0Profile: null,
            };
        }

        const payload = req.oidc.user as Auth0JwtPayload;
        if (!payload.sub) {
            throw new UnauthorizedException('Missing subject claim in user');
        }

        const user = await this.usersService.syncFromAuth0Payload(payload);

        return {
            isAuthenticated: true,
            user: this.mapUser(user),
            auth0Profile: this.mapAuth0Profile(payload),
        };
    }

    private normalizeReturnPath(value?: string): string {
        if (!value) {
            return '/';
        }
        try {
            const resolvedUrl = new URL(value, this.baseUrl);
            const origin = resolvedUrl.origin;

            if (origin === this.baseOrigin) {
                const path = `${resolvedUrl.pathname}${resolvedUrl.search}${resolvedUrl.hash}`;
                return path.startsWith('/') ? path : `/${path}`;
            }

            if (this.allowedReturnOrigins.has(origin)) {
                return resolvedUrl.toString();
            }

            return '/';
        } catch {
            return '/';
        }
    }

    private mapUser(user: User): AuthenticatedUserProfile {
        return {
            id: user.id,
            email: user.email,
            fullName: user.fullName ?? null,
            locale: user.locale ?? null,
            lastLoginAt: user.lastLoginAt ?? null,
        };
    }

    private mapAuth0Profile(payload: Auth0JwtPayload): Auth0Profile {
        return {
            sub: payload.sub,
            email: this.extractOptionalString(payload.email),
            name: this.extractOptionalString(payload.name),
            picture: this.extractOptionalString(payload.picture),
            given_name: this.extractOptionalString(payload.given_name),
            family_name: this.extractOptionalString(payload.family_name),
            locale: this.extractOptionalString(payload.locale),
        };
    }

    private extractOptionalString(value: unknown): string | undefined {
        return typeof value === 'string' && value.length > 0
            ? value
            : undefined;
    }
}
