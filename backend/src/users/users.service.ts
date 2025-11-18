import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { Auth0JwtPayload } from '../auth/auth.types';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async findByAuth0Id(auth0Id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { auth0Id },
        });
    }

    async syncFromAuth0Payload(payload: Auth0JwtPayload): Promise<User> {
        const auth0Id = payload.sub;
        if (!auth0Id) {
            throw new UnauthorizedException('Missing subject claim in token');
        }

        const email = this.extractEmail(payload);
        const fullName = this.extractStringClaim(payload.name);
        const locale = this.extractStringClaim(payload.locale);

        const now = new Date();

        return this.prisma.user.upsert({
            where: { auth0Id },
            update: {
                email,
                fullName,
                locale,
                lastLoginAt: now,
            },
            create: {
                auth0Id,
                email: email ?? this.fallbackEmail(auth0Id),
                fullName,
                locale,
                lastLoginAt: now,
            },
        });
    }

    private extractEmail(payload: Auth0JwtPayload): string | undefined {
        const emailClaim = this.extractStringClaim(payload.email);
        if (emailClaim) {
            return emailClaim.toLowerCase();
        }
        const emailFromProfile = this.extractStringClaim(
            payload['https://veronero.ai/email'] as string | undefined,
        );
        return emailFromProfile?.toLowerCase();
    }

    private extractStringClaim(value: unknown): string | undefined {
        return typeof value === 'string' && value.length > 0
            ? value
            : undefined;
    }

    private fallbackEmail(auth0Id: string): string {
        return `${auth0Id.replace(/[^a-zA-Z0-9]/g, '_')}@auth0.local`;
    }

    async updateUser(
        userId: string,
        data: Prisma.UserUpdateInput,
    ): Promise<User> {
        return this.prisma.user.update({
            where: { id: userId },
            data,
        });
    }
}
