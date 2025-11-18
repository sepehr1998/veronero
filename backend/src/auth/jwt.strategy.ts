import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { passportJwtSecret } from 'jwks-rsa';
import { Strategy, type JwtFromRequestFunction } from 'passport-jwt';
import { Auth0JwtPayload } from './auth.types';

const bearerTokenExtractor: JwtFromRequestFunction = (request: Request) => {
    const authHeader = request.headers?.authorization;
    if (typeof authHeader !== 'string') {
        return null;
    }
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        const domain = configService.getOrThrow<string>('auth.domain');
        const audience = configService.getOrThrow<string>('auth.audience');
        const issuer = configService.getOrThrow<string>('auth.issuerUrl');

        super({
            jwtFromRequest: bearerTokenExtractor,
            audience,
            issuer,
            algorithms: ['RS256'],
            secretOrKeyProvider: passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: `https://${domain}/.well-known/jwks.json`,
            }),
        });
    }

    validate(payload: Auth0JwtPayload): Auth0JwtPayload {
        if (!payload?.sub) {
            throw new UnauthorizedException('Invalid token payload');
        }
        return {
            sub: payload.sub,
            email: this.extractOptionalString(payload.email),
            name: this.extractOptionalString(payload.name),
            given_name: this.extractOptionalString(payload.given_name),
            family_name: this.extractOptionalString(payload.family_name),
            locale: this.extractOptionalString(payload.locale),
            picture: this.extractOptionalString(payload.picture),
            scope: payload.scope,
            permissions: Array.isArray(payload.permissions)
                ? payload.permissions
                : undefined,
            aud: payload.aud,
            iss: payload.iss,
            iat: payload.iat,
            exp: payload.exp,
        };
    }

    private extractOptionalString(value: unknown): string | undefined {
        return typeof value === 'string' && value.length > 0
            ? value
            : undefined;
    }
}
