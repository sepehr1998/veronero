import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Job } from 'bullmq';
import { AiScenarioService } from '../ai/ai-scenario.service';
import { PrismaService } from '../database/prisma.service';
import { TaxCalculationService } from '../tax-scenarios/tax-calculation.service';
import { TaxScenarioInputDto } from '../tax-scenarios/dto/tax-scenario-input.dto';
import { SCENARIO_QUEUE } from '../queue/queue.constants';
import type { TaxScenarioJobData } from '../tax-scenarios/tax-scenario-queue.service';
import { randomUUID } from 'crypto';

@Processor(SCENARIO_QUEUE)
@Injectable()
export class TaxScenarioProcessor extends WorkerHost {
    private readonly logger = new Logger(TaxScenarioProcessor.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly calculationService: TaxCalculationService,
        private readonly aiScenarioService: AiScenarioService,
    ) {
        super();
    }

    async process(job: Job<TaxScenarioJobData>): Promise<void> {
        const { scenario_id } = job.data;
        if (!scenario_id) {
            this.logger.error('scenario_id missing from job payload');
            return;
        }

        const scenario = await this.prisma.taxScenario.findUnique({
            where: { id: scenario_id },
            include: {
                inputs: { orderBy: { createdAt: 'desc' }, take: 1 },
            },
        });
        if (!scenario) {
            this.logger.error(`Scenario ${scenario_id} not found`);
            return;
        }

        const inputRecord = scenario.inputs[0];
        if (!inputRecord) {
            this.logger.error(`Scenario ${scenario_id} has no inputs`);
            return;
        }

        const inputs: TaxScenarioInputDto = {
            incomeJson: inputRecord.incomeJson as Record<string, unknown>,
            deductionsJson:
                inputRecord.deductionsJson as Record<string, unknown>,
            assumptionsJson:
                inputRecord.assumptionsJson as Record<string, unknown>,
            lifeEventsJson:
                inputRecord.lifeEventsJson as Record<string, unknown>,
        };

        try {
            const result = this.calculationService.calculate(
                scenario.taxRegimeId,
                inputs,
            );

        const recommendation =
            await this.aiScenarioService.recommendForScenario({
                ...inputs.incomeJson,
                deductions: inputs.deductionsJson,
                assumptions: inputs.assumptionsJson,
                lifeEvents: inputs.lifeEventsJson,
            });

            await this.prisma.$transaction(async (tx) => {
                await tx.taxScenarioResult.create({
                    data: {
                        id: randomUUID(),
                        scenarioId: scenario.id,
                        taxableIncome: result.taxableIncome,
                        estimatedTax: result.estimatedTax,
                        netIncome: result.netIncome,
                        breakdownJson: result.breakdown as Prisma.InputJsonValue,
                        comparisonsJson: Prisma.DbNull,
                    },
                });

                await tx.taxScenarioRecommendation.create({
                    data: {
                        id: randomUUID(),
                        scenarioId: scenario.id,
                        aiSummaryText: recommendation.summary,
                        recommendationsJson: {
                            recommendations: recommendation.recommendations,
                            rationale: recommendation.rationale,
                        } as Prisma.InputJsonValue,
                    },
                });
            });

            this.logger.log(`Calculated scenario ${scenario.id}`);
        } catch (error) {
            this.logger.error(
                `Failed to calculate scenario ${scenario_id}: ${error}`,
            );
            throw error;
        }
    }
}
