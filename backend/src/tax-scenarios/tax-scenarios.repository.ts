import { Injectable } from '@nestjs/common';
import { Prisma, TaxScenario, TaxScenarioInput, TaxScenarioResult, TaxScenarioRecommendation } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class TaxScenariosRepository {
    constructor(private readonly prisma: PrismaService) {}

    async createScenario(data: Prisma.TaxScenarioCreateInput): Promise<TaxScenario> {
        return this.prisma.taxScenario.create({ data });
    }

    async updateScenario(id: string, accountId: string, data: Prisma.TaxScenarioUpdateInput): Promise<TaxScenario | null> {
        const updated = await this.prisma.taxScenario.updateMany({
            where: { id, accountId },
            data,
        });
        if (updated.count === 0) {
            return null;
        }
        return this.findById(id, accountId);
    }

    async deleteScenario(id: string, accountId: string): Promise<void> {
        await this.prisma.taxScenario.deleteMany({ where: { id, accountId } });
    }

    async listByAccount(accountId: string): Promise<TaxScenario[]> {
        return this.prisma.taxScenario.findMany({
            where: { accountId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findById(id: string, accountId: string): Promise<(TaxScenario & { inputs: TaxScenarioInput[]; results: TaxScenarioResult[]; recommendations: TaxScenarioRecommendation[] }) | null> {
        return this.prisma.taxScenario.findFirst({
            where: { id, accountId },
            include: {
                inputs: {
                    orderBy: { createdAt: 'desc' },
                },
                results: {
                    orderBy: { createdAt: 'desc' },
                },
                recommendations: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
    }

    async upsertInputs(scenarioId: string, data: Prisma.TaxScenarioInputCreateInput): Promise<TaxScenarioInput> {
        const existing = await this.prisma.taxScenarioInput.findFirst({
            where: { scenarioId },
            orderBy: { createdAt: 'desc' },
        });

        if (existing) {
            return this.prisma.taxScenarioInput.update({
                where: { id: existing.id },
                data,
            });
        }

        return this.prisma.taxScenarioInput.create({ data });
    }

    async createResult(data: Prisma.TaxScenarioResultCreateInput): Promise<TaxScenarioResult> {
        return this.prisma.taxScenarioResult.create({ data });
    }

    async createRecommendation(data: Prisma.TaxScenarioRecommendationCreateInput): Promise<TaxScenarioRecommendation> {
        return this.prisma.taxScenarioRecommendation.create({ data });
    }
}
