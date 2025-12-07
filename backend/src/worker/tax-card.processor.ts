import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Prisma, TaxCardStatus } from '@prisma/client';
import { Job } from 'bullmq';
import { PrismaService } from '../database/prisma.service';
import { FileStorageService } from '../storage/file-storage.service';
import { AiTaxCardService } from '../ai/ai-tax-card.service';
import { TAX_CARD_PROCESS_JOB, TAX_CARD_QUEUE } from '../tax-cards/tax-cards.constants';
import type { ProcessTaxCardJobData } from '../tax-cards/tax-card-queue.service';

@Processor(TAX_CARD_QUEUE)
@Injectable()
export class TaxCardProcessor extends WorkerHost {
    private readonly logger = new Logger(TaxCardProcessor.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly fileStorageService: FileStorageService,
        private readonly aiTaxCardService: AiTaxCardService,
    ) {
        super();
    }

    async process(job: Job<ProcessTaxCardJobData>): Promise<void> {
        if (job.name !== TAX_CARD_PROCESS_JOB) {
            this.logger.debug(`Skipping unsupported job ${job.name}`);
            return;
        }

        const { tax_card_id, file_storage_key } = job.data;
        if (!tax_card_id || !file_storage_key) {
            this.logger.error('Job payload missing required fields');
            return;
        }

        try {
            await this.prisma.taxCard.update({
                where: { id: tax_card_id },
                data: { status: TaxCardStatus.PROCESSING },
            });

            const fileStream = await this.fileStorageService.getTaxCardStream(
                file_storage_key,
            );
            const fileBuffer = await this.streamToBuffer(fileStream);

            const aiResult = await this.aiTaxCardService.parseTaxCard(
                fileBuffer,
            );

            await this.prisma.$transaction(async (tx) => {
                await tx.taxCardParsed.upsert({
                    where: { taxCardId: tax_card_id },
                    update: {
                        sourceJson: this.coerceJson(aiResult.parsed.sourceJson),
                        withholdingPercentage: new Prisma.Decimal(
                            aiResult.parsed.withholdingPercentage,
                        ),
                        secondaryWithholdingPercentage:
                            aiResult.parsed.secondaryWithholdingPercentage !==
                            undefined
                                ? new Prisma.Decimal(
                                      aiResult.parsed
                                          .secondaryWithholdingPercentage ??
                                          0,
                                  )
                                : null,
                        incomeLimit: new Prisma.Decimal(
                            aiResult.parsed.incomeLimit,
                        ),
                        validFrom: aiResult.parsed.validFrom,
                        validTo: aiResult.parsed.validTo ?? null,
                        otherFieldsJson: this.coerceJson(
                            aiResult.parsed.otherFieldsJson,
                        ),
                    },
                    create: {
                        taxCardId: tax_card_id,
                        sourceJson: this.coerceJson(aiResult.parsed.sourceJson),
                        withholdingPercentage: new Prisma.Decimal(
                            aiResult.parsed.withholdingPercentage,
                        ),
                        secondaryWithholdingPercentage:
                            aiResult.parsed.secondaryWithholdingPercentage !==
                            undefined
                                ? new Prisma.Decimal(
                                      aiResult.parsed
                                          .secondaryWithholdingPercentage ??
                                          0,
                                  )
                                : null,
                        incomeLimit: new Prisma.Decimal(
                            aiResult.parsed.incomeLimit,
                        ),
                        validFrom: aiResult.parsed.validFrom,
                        validTo: aiResult.parsed.validTo ?? null,
                        otherFieldsJson: this.coerceJson(
                            aiResult.parsed.otherFieldsJson,
                        ),
                    },
                });

                await tx.taxCardAnalysis.create({
                    data: {
                        taxCardId: tax_card_id,
                        aiSummaryText: aiResult.analysis.aiSummaryText,
                        keyPointsJson: this.coerceJson(
                            aiResult.analysis.keyPointsJson,
                        ),
                        recommendationsJson: this.coerceJson(
                            aiResult.analysis.recommendationsJson,
                        ),
                    },
                });

                await tx.taxCard.update({
                    where: { id: tax_card_id },
                    data: { status: TaxCardStatus.PARSED },
                });
            });

            this.logger.log(
                `Processed tax card ${tax_card_id} successfully`,
            );
        } catch (error) {
            this.logger.error(
                `Failed processing tax card ${tax_card_id}: ${error}`,
            );
            await this.prisma.taxCard.update({
                where: { id: tax_card_id },
                data: { status: TaxCardStatus.ERROR },
            });
            throw error;
        }
    }

    private async streamToBuffer(
        stream: NodeJS.ReadableStream,
    ): Promise<Buffer> {
        const chunks: Buffer[] = [];
        for await (const chunk of stream) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }
        return Buffer.concat(chunks);
    }

    private coerceJson(
        value: unknown,
    ): Prisma.InputJsonValue {
        if (value === null || value === undefined) {
            return {};
        }
        if (typeof value === 'object') {
            return value as Prisma.InputJsonValue;
        }
        return {};
    }
}
