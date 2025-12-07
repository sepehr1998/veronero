import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Job } from 'bullmq';
import { AiReceiptService } from '../ai/ai-receipt.service';
import { PrismaService } from '../database/prisma.service';
import { FileStorageService } from '../storage/file-storage.service';
import { RECEIPT_QUEUE } from '../queue/queue.constants';
import type { ReceiptJobData } from '../receipts/receipt-queue.service';
import { ReceiptStatus } from '@prisma/client';

@Processor(RECEIPT_QUEUE)
@Injectable()
export class ReceiptProcessor extends WorkerHost {
    private readonly logger = new Logger(ReceiptProcessor.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly fileStorageService: FileStorageService,
        private readonly aiReceiptService: AiReceiptService,
    ) {
        super();
    }

    async process(job: Job<ReceiptJobData>): Promise<void> {
        const { receipt_file_id, file_storage_key } = job.data;
        if (!receipt_file_id || !file_storage_key) {
            this.logger.error('Missing required job data for receipt processing');
            return;
        }

        try {
            await this.prisma.receiptFile.update({
                where: { id: receipt_file_id },
                data: { status: ReceiptStatus.PROCESSING },
            });

            const stream = await this.fileStorageService.getTaxCardStream(
                file_storage_key,
            );
            const buffer = await this.streamToBuffer(stream);

            const aiResult = await this.aiReceiptService.extractReceipt(buffer);
            const suggestedDate = aiResult.date
                ? new Date(aiResult.date)
                : new Date();
            const suggestedAmount = new Prisma.Decimal(aiResult.total ?? 0);
            const confidence = new Prisma.Decimal(aiResult.confidence ?? 0);

            await this.prisma.$transaction(async (tx) => {
                await tx.receiptExtraction.upsert({
                    where: { receiptFileId: receipt_file_id },
                    update: {
                        extractedJson: this.coerceJson(aiResult.sourceJson),
                        suggestedAmount,
                        suggestedDate,
                        suggestedCategoryId: aiResult.suggestedCategoryId ?? null,
                        confidenceScore: confidence,
                    },
                    create: {
                        receiptFileId: receipt_file_id,
                        extractedJson: this.coerceJson(aiResult.sourceJson),
                        suggestedAmount,
                        suggestedDate,
                        suggestedCategoryId: aiResult.suggestedCategoryId ?? null,
                        confidenceScore: confidence,
                    },
                });

                await tx.receiptFile.update({
                    where: { id: receipt_file_id },
                    data: { status: ReceiptStatus.PARSED },
                });
            });

            this.logger.log(`Processed receipt ${receipt_file_id}`);
        } catch (error) {
            this.logger.error(
                `Failed to process receipt ${receipt_file_id}: ${error}`,
            );
            await this.prisma.receiptFile.update({
                where: { id: receipt_file_id },
                data: { status: ReceiptStatus.ERROR },
            });
            throw error;
        }
    }

    private async streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
        const chunks: Buffer[] = [];
        for await (const chunk of stream) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }
        return Buffer.concat(chunks);
    }

    private coerceJson(value: unknown): Prisma.InputJsonValue {
        if (value === null || value === undefined) {
            return {};
        }
        if (typeof value === 'object') {
            return value as Prisma.InputJsonValue;
        }
        return {};
    }
}
