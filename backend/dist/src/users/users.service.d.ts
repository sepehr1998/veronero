import { Prisma, User } from '@prisma/client';
import { Auth0JwtPayload } from '../auth/auth.types';
import { PrismaService } from '../database/prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByAuth0Id(auth0Id: string): Promise<User | null>;
    syncFromAuth0Payload(payload: Auth0JwtPayload): Promise<User>;
    private extractEmail;
    private extractStringClaim;
    private fallbackEmail;
    updateUser(userId: string, data: Prisma.UserUpdateInput): Promise<User>;
}
