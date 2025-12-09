"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../database/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByAuth0Id(auth0Id) {
        return this.prisma.user.findUnique({
            where: { auth0Id },
        });
    }
    async syncFromAuth0Payload(payload) {
        const auth0Id = payload.sub;
        if (!auth0Id) {
            throw new common_1.UnauthorizedException('Missing subject claim in token');
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
    extractEmail(payload) {
        const emailClaim = this.extractStringClaim(payload.email);
        if (emailClaim) {
            return emailClaim.toLowerCase();
        }
        const emailFromProfile = this.extractStringClaim(payload['https://veronero.ai/email']);
        return emailFromProfile?.toLowerCase();
    }
    extractStringClaim(value) {
        return typeof value === 'string' && value.length > 0
            ? value
            : undefined;
    }
    fallbackEmail(auth0Id) {
        return `${auth0Id.replace(/[^a-zA-Z0-9]/g, '_')}@auth0.local`;
    }
    async updateUser(userId, data) {
        return this.prisma.user.update({
            where: { id: userId },
            data,
        });
    }
    async listUserAccounts(userId) {
        return this.prisma.userAccount.findMany({
            where: { userId },
            include: { account: true },
            orderBy: { createdAt: 'asc' },
        });
    }
    async ensureDefaultAccountForUser(user) {
        const existing = await this.prisma.userAccount.findFirst({
            where: { userId: user.id },
            include: { account: true },
        });
        if (existing?.account) {
            return existing.account;
        }
        let country = (await this.prisma.country.findFirst({
            orderBy: { code: 'asc' },
        })) ?? null;
        if (!country) {
            country = await this.prisma.country.upsert({
                where: { code: 'FI' },
                update: {},
                create: {
                    code: 'FI',
                    name: 'Finland',
                },
            });
        }
        await this.prisma.taxRegime.upsert({
            where: { slug: `${country.code.toLowerCase()}_individual_default` },
            update: { isActive: true },
            create: {
                slug: `${country.code.toLowerCase()}_individual_default`,
                displayName: `${country.name} Default Individual Taxation`,
                countryCode: country.code,
                isActive: true,
            },
        });
        const account = await this.prisma.account.create({
            data: {
                name: user.fullName ?? `${user.email}'s account`,
                type: client_1.AccountType.INDIVIDUAL,
                countryCode: country.code,
            },
        });
        await this.prisma.userAccount.create({
            data: {
                userId: user.id,
                accountId: account.id,
                role: client_1.UserAccountRole.OWNER,
            },
        });
        return account ?? null;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map