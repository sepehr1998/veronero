import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Account, Prisma, TaxRegime, UserTaxProfile } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { UpdateTaxProfileDto } from './dto/update-tax-profile.dto';

export interface TaxProfileResponse {
    id: string;
    userId: string;
    accountId: string;
    taxRegimeId: string;
    occupation: string | null;
    profileData: Prisma.JsonObject;
    createdAt: Date;
    updatedAt: Date;
    taxRegime?: TaxRegime;
}

@Injectable()
export class TaxProfilesService {
    constructor(private readonly prisma: PrismaService) {}

    async getCurrentProfile(
        userId: string,
        accountId: string,
    ): Promise<TaxProfileResponse | null> {
        await this.assertAccountAccess(userId, accountId);

        const profile = await this.prisma.userTaxProfile.findFirst({
            where: { userId, accountId },
            include: { taxRegime: true },
            orderBy: { createdAt: 'desc' },
        });

        if (!profile) {
            return null;
        }

        return this.mapProfile(profile);
    }

    async updateCurrentProfile(
        userId: string,
        accountId: string,
        input: UpdateTaxProfileDto,
    ): Promise<TaxProfileResponse> {
        const account = await this.assertAccountAccess(userId, accountId);
        const validatedInput = this.validateUpdatePayload(input);

        const existingProfile = await this.prisma.userTaxProfile.findFirst({
            where: { userId, accountId },
            include: { taxRegime: true },
            orderBy: { createdAt: 'desc' },
        });

        const resolvedTaxRegimeId =
            this.normalizeOptionalString(validatedInput.taxRegimeId) ??
            this.normalizeOptionalString(existingProfile?.taxRegimeId) ??
            (await this.defaultTaxRegimeId(account.countryCode));

        if (!resolvedTaxRegimeId) {
            throw new BadRequestException(
                'taxRegimeId is required for this account',
            );
        }

        const taxRegime = await this.validateTaxRegime(
            resolvedTaxRegimeId,
            account.countryCode,
        );

        const occupation =
            validatedInput.occupation !== undefined
                ? validatedInput.occupation
                : (existingProfile?.occupation ?? null);
        const profileData =
            validatedInput.profileData !== undefined
                ? this.ensureJsonObject(validatedInput.profileData)
                : this.ensureJsonObject(existingProfile?.profileDataJson);

        let upsertedProfile: UserTaxProfile;
        try {
            if (existingProfile) {
                upsertedProfile = await this.prisma.userTaxProfile.update({
                    where: { id: existingProfile.id },
                    data: {
                        taxRegimeId: taxRegime.id,
                        occupation,
                        profileDataJson: profileData,
                    },
                });
            } else {
                upsertedProfile = await this.prisma.userTaxProfile.create({
                    data: {
                        userId,
                        accountId,
                        taxRegimeId: taxRegime.id,
                        occupation,
                        profileDataJson: profileData,
                    },
                });
            }
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2003'
            ) {
                throw new BadRequestException(
                    'Invalid taxRegimeId for this account',
                );
            }
            throw error;
        }

        return this.mapProfile({ ...upsertedProfile, taxRegime });
    }

    private async assertAccountAccess(
        userId: string,
        accountId: string,
    ): Promise<Account> {
        const membership = await this.prisma.userAccount.findFirst({
            where: { userId, accountId },
            include: { account: true },
        });

        if (!membership) {
            throw new ForbiddenException('Account not found for current user');
        }

        return membership.account;
    }

    private async validateTaxRegime(
        taxRegimeIdOrSlug: string,
        countryCode?: string,
    ): Promise<TaxRegime> {
        let taxRegime = await this.resolveTaxRegime(
            taxRegimeIdOrSlug,
            countryCode,
        );

        if (!taxRegime && countryCode) {
            // Try to ensure a default regime exists for this country, then re-resolve
            await this.ensureDefaultTaxRegime(countryCode);
            taxRegime = await this.resolveTaxRegime(
                taxRegimeIdOrSlug,
                countryCode,
            );
        }

        if (!taxRegime) {
            throw new NotFoundException('Tax regime is not valid for account');
        }

        return taxRegime;
    }

    private validateUpdatePayload(
        payload: UpdateTaxProfileDto,
    ): UpdateTaxProfileDto {
        if (
            payload.taxRegimeId !== undefined &&
            typeof payload.taxRegimeId !== 'string'
        ) {
            throw new BadRequestException('taxRegimeId must be a string');
        }

        if (
            payload.occupation !== undefined &&
            payload.occupation !== null &&
            typeof payload.occupation !== 'string'
        ) {
            throw new BadRequestException(
                'occupation must be a string or null',
            );
        }

        if (
            payload.profileData !== undefined &&
            !this.isRecord(payload.profileData)
        ) {
            throw new BadRequestException('profileData must be an object');
        }

        return payload;
    }

    private ensureJsonObject(
        data: Prisma.JsonValue | null | undefined,
    ): Prisma.JsonObject {
        if (this.isRecord(data)) {
            return data;
        }
        return {};
    }

    private isRecord(value: unknown): value is Record<string, unknown> {
        return (
            typeof value === 'object' && value !== null && !Array.isArray(value)
        );
    }

    private normalizeOptionalString(value?: string | null): string | undefined {
        if (typeof value !== 'string') {
            return undefined;
        }
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : undefined;
    }

    private mapProfile(
        profile: UserTaxProfile & { taxRegime?: TaxRegime | null },
    ): TaxProfileResponse {
        return {
            id: profile.id,
            userId: profile.userId,
            accountId: profile.accountId,
            taxRegimeId: profile.taxRegimeId,
            occupation: profile.occupation ?? null,
            profileData: this.ensureJsonObject(profile.profileDataJson),
            createdAt: profile.createdAt,
            updatedAt: profile.updatedAt,
            taxRegime: profile.taxRegime ?? undefined,
        };
    }

    private async defaultTaxRegimeId(
        countryCode?: string,
    ): Promise<string | null> {
        if (!countryCode) {
            return null;
        }
        let regime = await this.prisma.taxRegime.findFirst({
            where: { countryCode, isActive: true },
            orderBy: { createdAt: 'asc' },
        });
        if (!regime) {
            regime = await this.ensureDefaultTaxRegime(countryCode);
        }
        return regime?.id ?? null;
    }

    private async resolveTaxRegime(
        taxRegimeIdOrSlug: string,
        countryCode?: string,
    ): Promise<TaxRegime | null> {
        const whereBase = countryCode ? { countryCode } : {};
        if (this.isUuid(taxRegimeIdOrSlug)) {
            return this.prisma.taxRegime.findFirst({
                where: { id: taxRegimeIdOrSlug, isActive: true, ...whereBase },
            });
        }
        return this.prisma.taxRegime.findFirst({
            where: { slug: taxRegimeIdOrSlug, isActive: true, ...whereBase },
        });
    }

    private async ensureDefaultTaxRegime(
        countryCode: string,
    ): Promise<TaxRegime | null> {
        const slug = `${countryCode.toLowerCase()}_individual_default`;
        await this.prisma.country.upsert({
            where: { code: countryCode },
            update: {},
            create: {
                code: countryCode,
                name: countryCode,
            },
        });

        await this.prisma.taxRegime.upsert({
            where: { slug },
            update: { isActive: true, countryCode },
            create: {
                slug,
                displayName: `${countryCode} Default Individual Taxation`,
                countryCode,
                isActive: true,
            },
        });

        return this.prisma.taxRegime.findFirst({
            where: { slug, countryCode, isActive: true },
        });
    }

    private isUuid(value: string): boolean {
        return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
            value,
        );
    }
}
