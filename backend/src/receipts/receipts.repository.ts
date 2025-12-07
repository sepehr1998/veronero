import { Injectable } from '@nestjs/common';
import { Prisma, ReceiptExtraction, ReceiptFile, ReceiptStatus } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ReceiptsRepository {
    constructor(private readonly prisma: PrismaService) {}

    async createReceiptFile(data: Prisma.ReceiptFileCreateInput): Promise<ReceiptFile> {
        return this.prisma.receiptFile.create({ data });
    }

    async findReceiptById(id: string, accountId: string): Promise<ReceiptFile | null> {
        return this.prisma.receiptFile.findFirst({
            where: { id, accountId },
        });
    }

    async updateReceiptStatus(
        id: string,
        status: ReceiptStatus,
    ): Promise<ReceiptFile | null> {
        return this.prisma.receiptFile.update({ where: { id }, data: { status } }).catch(() => null);
    }

    async upsertExtraction(data: {
        receiptFileId: string;
        extractedJson: Prisma.InputJsonValue;
        suggestedAmount: Prisma.Decimal;
        suggestedDate: Date;
        suggestedCategoryId?: string | null;
        confidenceScore: Prisma.Decimal;
    }): Promise<ReceiptExtraction> {
        return this.prisma.receiptExtraction.upsert({
            where: { receiptFileId: data.receiptFileId },
            update: data,
            create: data,
        });
    }

    async findExtraction(receiptFileId: string): Promise<ReceiptExtraction | null> {
        return this.prisma.receiptExtraction.findUnique({ where: { receiptFileId } });
    }
}
