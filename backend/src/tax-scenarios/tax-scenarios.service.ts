import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    Account,
    Prisma,
    TaxScenario,
    TaxScenarioInput,
    TaxScenarioRecommendation,
    TaxScenarioResult,
} from '@prisma/client';
import { randomUUID } from 'crypto';
import { AiScenarioService } from '../ai/ai-scenario.service';
import { PrismaService } from '../database/prisma.service';
import { TaxScenarioQueueService } from './tax-scenario-queue.service';
import { CalculateTaxScenarioDto } from './dto/calculate-tax-scenario.dto';
import { CreateTaxScenarioDto } from './dto/create-tax-scenario.dto';
import { TaxScenarioInputDto } from './dto/tax-scenario-input.dto';
import { UpdateTaxScenarioDto } from './dto/update-tax-scenario.dto';
import { TaxScenariosRepository } from './tax-scenarios.repository';

export interface TaxScenarioResponse {
    id: string;
    userId: string;
    accountId: string;
    taxRegimeId: string;
    name: string;
    description: string | null;
    basedOnTaxCardId: string | null;
    basedOnProfileId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface TaxScenarioDetailResponse extends TaxScenarioResponse {
    inputs: TaxScenarioInput[];
    results: TaxScenarioResult[];
    recommendations: TaxScenarioRecommendation[];
}

@Injectable()
export class TaxScenariosService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly repo: TaxScenariosRepository,
        private readonly aiScenarioService: AiScenarioService,
        private readonly taxScenarioQueue: TaxScenarioQueueService,
    ) {}

    async create(
        userId: string,
        accountId: string,
        dto: CreateTaxScenarioDto,
    ): Promise<TaxScenarioResponse> {
        const account = await this.assertAccountAccess(userId, accountId);
        this.validateScenarioPayload(dto);
        await this.validateTaxRegime(dto.taxRegimeId, account.countryCode);
        await this.validateReferences(dto);

        const scenario = await this.repo.createScenario({
            id: randomUUID(),
            user: { connect: { id: userId } },
            account: { connect: { id: accountId } },
            taxRegime: { connect: { id: dto.taxRegimeId } },
            name: dto.name,
            description: dto.description ?? null,
            basedOnTaxCard: dto.basedOnTaxCardId
                ? { connect: { id: dto.basedOnTaxCardId } }
                : undefined,
            basedOnProfile: dto.basedOnProfileId
                ? { connect: { id: dto.basedOnProfileId } }
                : undefined,
        });

        if (dto.inputs) {
            await this.repo.upsertInputs(scenario.id, {
                id: randomUUID(),
                scenario: { connect: { id: scenario.id } },
                ...this.mapInput(dto.inputs),
            });
        }

        return this.mapScenario(scenario);
    }

    async list(userId: string, accountId: string): Promise<TaxScenarioResponse[]> {
        await this.assertAccountAccess(userId, accountId);
        const scenarios = await this.repo.listByAccount(accountId);
        return scenarios.map((s) => this.mapScenario(s));
    }

    async get(
        userId: string,
        accountId: string,
        scenarioId: string,
    ): Promise<TaxScenarioDetailResponse> {
        await this.assertAccountAccess(userId, accountId);
        const scenario = await this.repo.findById(scenarioId, accountId);
        if (!scenario) {
            throw new NotFoundException('Scenario not found');
        }
        return this.mapScenarioDetail(scenario);
    }

    async update(
        userId: string,
        accountId: string,
        scenarioId: string,
        dto: UpdateTaxScenarioDto,
    ): Promise<TaxScenarioDetailResponse> {
        const account = await this.assertAccountAccess(userId, accountId);
        const existing = await this.repo.findById(scenarioId, accountId);
        if (!existing) {
            throw new NotFoundException('Scenario not found');
        }
        this.validateScenarioPayload({ ...existing, ...dto } as CreateTaxScenarioDto);
        if (dto.taxRegimeId) {
            await this.validateTaxRegime(dto.taxRegimeId, account.countryCode);
        }
        await this.validateReferences(dto);

        const updated = await this.repo.updateScenario(scenarioId, accountId, {
            name: dto.name ?? undefined,
            description: dto.description ?? undefined,
            taxRegime: dto.taxRegimeId
                ? { connect: { id: dto.taxRegimeId } }
                : undefined,
            basedOnTaxCard:
                dto.basedOnTaxCardId !== undefined
                    ? dto.basedOnTaxCardId
                        ? { connect: { id: dto.basedOnTaxCardId } }
                        : { disconnect: true }
                    : undefined,
            basedOnProfile:
                dto.basedOnProfileId !== undefined
                    ? dto.basedOnProfileId
                        ? { connect: { id: dto.basedOnProfileId } }
                        : { disconnect: true }
                    : undefined,
        });

        if (!updated) {
            throw new ForbiddenException('Unable to update scenario');
        }

        if (dto.inputs) {
            await this.repo.upsertInputs(updated.id, {
                id: randomUUID(),
                scenario: { connect: { id: updated.id } },
                ...this.mapInput(dto.inputs),
            });
        }

        const withRelations = await this.repo.findById(updated.id, accountId);
        if (!withRelations) {
            throw new NotFoundException('Scenario not found after update');
        }
        return this.mapScenarioDetail(withRelations);
    }

    async delete(
        userId: string,
        accountId: string,
        scenarioId: string,
    ): Promise<void> {
        await this.assertAccountAccess(userId, accountId);
        const existing = await this.repo.findById(scenarioId, accountId);
        if (!existing) {
            throw new NotFoundException('Scenario not found');
        }
        await this.repo.deleteScenario(scenarioId, accountId);
    }

    async calculate(
        userId: string,
        accountId: string,
        scenarioId: string,
        dto: CalculateTaxScenarioDto,
    ): Promise<{ queued: boolean }> {
        await this.assertAccountAccess(userId, accountId);
        const scenario = await this.repo.findById(scenarioId, accountId);
        if (!scenario) {
            throw new NotFoundException('Scenario not found');
        }

        if (dto.inputs) {
            await this.repo.upsertInputs(scenario.id, {
                id: randomUUID(),
                scenario: { connect: { id: scenario.id } },
                ...this.mapInput(dto.inputs),
            });
        }

        await this.taxScenarioQueue.enqueueCalculateScenario(scenario.id);
        return { queued: true };
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

    private validateScenarioPayload(dto: Partial<CreateTaxScenarioDto>) {
        if (!dto.name) {
            throw new BadRequestException('name is required');
        }
        if (!dto.taxRegimeId) {
            throw new BadRequestException('taxRegimeId is required');
        }
        if (dto.inputs) {
            this.ensureInput(dto.inputs);
        }
    }

    private ensureInput(input: TaxScenarioInputDto) {
        if (
            !input.incomeJson ||
            typeof input.incomeJson !== 'object' ||
            Array.isArray(input.incomeJson)
        ) {
            throw new BadRequestException('incomeJson must be an object');
        }
        if (
            !input.deductionsJson ||
            typeof input.deductionsJson !== 'object' ||
            Array.isArray(input.deductionsJson)
        ) {
            throw new BadRequestException('deductionsJson must be an object');
        }
    }

    private async validateTaxRegime(
        taxRegimeId: string,
        countryCode?: string,
    ) {
        const taxRegime = await this.prisma.taxRegime.findFirst({
            where: {
                id: taxRegimeId,
                isActive: true,
                ...(countryCode ? { countryCode } : null),
            },
        });
        if (!taxRegime) {
            throw new NotFoundException('Tax regime is not valid for account');
        }
    }

    private async validateReferences(dto: {
        basedOnTaxCardId?: string | null;
        basedOnProfileId?: string | null;
    }) {
        if (dto.basedOnTaxCardId) {
            const card = await this.prisma.taxCard.findUnique({
                where: { id: dto.basedOnTaxCardId },
            });
            if (!card) {
                throw new NotFoundException('basedOnTaxCardId not found');
            }
        }
        if (dto.basedOnProfileId) {
            const profile = await this.prisma.userTaxProfile.findUnique({
                where: { id: dto.basedOnProfileId },
            });
            if (!profile) {
                throw new NotFoundException('basedOnProfileId not found');
            }
        }
    }

    private mapScenario(scenario: TaxScenario): TaxScenarioResponse {
        return {
            id: scenario.id,
            userId: scenario.userId,
            accountId: scenario.accountId,
            taxRegimeId: scenario.taxRegimeId,
            name: scenario.name,
            description: scenario.description ?? null,
            basedOnTaxCardId: scenario.basedOnTaxCardId ?? null,
            basedOnProfileId: scenario.basedOnProfileId ?? null,
            createdAt: scenario.createdAt,
            updatedAt: scenario.updatedAt,
        };
    }

    private mapScenarioDetail(
        scenario: TaxScenario & {
            inputs: TaxScenarioInput[];
            results: TaxScenarioResult[];
            recommendations: TaxScenarioRecommendation[];
        },
    ): TaxScenarioDetailResponse {
        return {
            ...this.mapScenario(scenario),
            inputs: scenario.inputs,
            results: scenario.results,
            recommendations: scenario.recommendations,
        };
    }

    private mapInput(input: TaxScenarioInputDto): {
        incomeJson: Prisma.InputJsonValue;
        deductionsJson: Prisma.InputJsonValue;
        assumptionsJson: Prisma.InputJsonValue;
        lifeEventsJson: Prisma.InputJsonValue;
    } {
        return {
            incomeJson: this.toJson(input.incomeJson),
            deductionsJson: this.toJson(input.deductionsJson),
            assumptionsJson: this.toJson(input.assumptionsJson),
            lifeEventsJson: this.toJson(input.lifeEventsJson),
        };
    }

    private toJson(value: unknown): Prisma.InputJsonValue {
        if (value === null || value === undefined) {
            return {};
        }
        if (typeof value === 'object') {
            return value as Prisma.InputJsonValue;
        }
        return {};
    }
}
