import { UnauthorizedException } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { User } from '@prisma/client';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import type { UsersService } from '../users/users.service';

describe('AuthService', () => {
    let service: AuthService;
    let usersService: jest.Mocked<UsersService>;
    let configService: ConfigService;

    beforeEach(() => {
        usersService = {
            syncFromAuth0Payload: jest.fn(),
        } as unknown as jest.Mocked<UsersService>;

        const getOrThrow = jest.fn((key: string) => {
            switch (key) {
                case 'auth.baseUrl':
                    return 'http://localhost:4000';
                case 'auth.audience':
                    return 'https://api.veronero.ai';
                default:
                    throw new Error(`Unexpected config key: ${key}`);
            }
        });

        configService = { getOrThrow } as unknown as ConfigService;
        service = new AuthService(configService, usersService);
    });

    it('calls login with sanitized return path', async () => {
        const login = jest.fn().mockResolvedValue(undefined);
        const res = { oidc: { login } } as unknown as Response;

        await service.login(res, { returnTo: 'https://evil.example.com' });

        expect(login).toHaveBeenCalledWith(
            expect.objectContaining({
                returnTo: '/',
                authorizationParams: expect.objectContaining({
                    audience: 'https://api.veronero.ai',
                }),
            }),
        );
    });

    it('passes through safe return path to login', async () => {
        const login = jest.fn().mockResolvedValue(undefined);
        const res = { oidc: { login } } as unknown as Response;

        await service.login(res, { returnTo: '/dashboard' });

        expect(login).toHaveBeenCalledWith(
            expect.objectContaining({
                returnTo: '/dashboard',
            }),
        );
    });

    it('calls logout with sanitized return path', async () => {
        const logout = jest.fn().mockResolvedValue(undefined);
        const res = { oidc: { logout } } as unknown as Response;

        await service.logout(res, 'https://evil.example.com/logout');

        expect(logout).toHaveBeenCalledWith({ returnTo: '/' });
    });

    it('delegates to oidc callback handler', async () => {
        const callback = jest.fn().mockResolvedValue(undefined);
        const res = { oidc: { callback } } as unknown as Response;

        await service.handleCallback(res);

        expect(callback).toHaveBeenCalledWith(
            expect.objectContaining({
                redirectUri: 'http://localhost:4000/auth/callback',
            }),
        );
    });

    it('returns unauthenticated session when oidc user missing', async () => {
        const req = {
            oidc: {
                isAuthenticated: jest.fn().mockReturnValue(false),
                user: undefined,
            },
        } as unknown as Request;

        await expect(service.getSession(req)).resolves.toEqual({
            isAuthenticated: false,
            user: null,
            auth0Profile: null,
        });
    });

    it('throws when authenticated but no subject is present', async () => {
        const req = {
            oidc: {
                isAuthenticated: jest.fn().mockReturnValue(true),
                user: {},
            },
        } as unknown as Request;

        await expect(service.getSession(req)).rejects.toBeInstanceOf(
            UnauthorizedException,
        );
    });

    it('syncs the user and returns session payload', async () => {
        const now = new Date();
        const req = {
            oidc: {
                isAuthenticated: jest.fn().mockReturnValue(true),
                user: {
                    sub: 'auth0|user',
                    email: 'test@example.com',
                    name: 'Test User',
                    picture: 'https://example.com/avatar.png',
                },
            },
        } as unknown as Request;

        usersService.syncFromAuth0Payload.mockResolvedValue({
            id: 'user-id',
            auth0Id: 'auth0|user',
            email: 'test@example.com',
            fullName: 'Test User',
            locale: 'en',
            lastLoginAt: now,
            createdAt: now,
            updatedAt: now,
        } as User);

        await expect(service.getSession(req)).resolves.toEqual({
            isAuthenticated: true,
            user: {
                id: 'user-id',
                email: 'test@example.com',
                fullName: 'Test User',
                locale: 'en',
                lastLoginAt: now,
            },
            auth0Profile: {
                sub: 'auth0|user',
                email: 'test@example.com',
                name: 'Test User',
                picture: 'https://example.com/avatar.png',
                given_name: undefined,
                family_name: undefined,
                locale: undefined,
            },
        });
    });
});
