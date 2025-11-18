import type { JwtPayload } from 'jsonwebtoken';
import type { Request } from 'express';
import type { User } from '@prisma/client';

export interface Auth0JwtPayload extends JwtPayload {
    sub: string;
    email?: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    locale?: string;
    picture?: string;
    [key: string]: unknown;
}

export interface AuthenticatedRequest extends Request {
    user?: Auth0JwtPayload;
    authUser?: User;
}

export interface AuthenticatedUserProfile {
    id: string;
    email: string;
    fullName: string | null;
    locale: string | null;
    lastLoginAt: Date | null;
}

export interface Auth0Profile {
    sub: string;
    email?: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    picture?: string;
    locale?: string;
}

export interface AuthSession {
    isAuthenticated: boolean;
    user: AuthenticatedUserProfile | null;
    auth0Profile: Auth0Profile | null;
}
