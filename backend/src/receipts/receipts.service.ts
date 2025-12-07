import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    Account,
    ExpenseSource,
    ReceiptFile,
    ReceiptStatus,
} from '@prisma/client';
import { randomUUID } from 'crypto';
import type { Readable } from 'stream';
import { PrismaService } from '../database/prisma.service';
import { FileStorageService } from '../storage/file-storage.service';
import { ExpensesService } from '../expenses/expenses.service';
import { ReceiptsRepository } from './receipts.repository';
import { ReceiptQueueService } from './receipt-queue.service';
import { ConfirmReceiptDto } from './dto/confirm-receipt.dto';

export interface UploadReceiptFile {
    fileName: string;
    buffer: Buffer | Readable;
}

@Injectable()
export class ReceiptsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly receiptsRepository: ReceiptsRepository,
        private readonly fileStorageService: FileStorageService,
        private readonly receiptQueueService: ReceiptQueueService,
        private readonly expensesService: ExpensesService,
    ) {}

    async uploadReceipt(params: {
        userId: string;
        accountId: string;
        file: UploadReceiptFile;
    }): Promise<ReceiptFile> {
        const account = await this.assertAccountAccess(
            params.userId,
            params.accountId,
        );

        if (!params.file?.fileName || !params.file.buffer) {
            throw new BadRequestException('File is required');
        }

        const storageKey = this.buildStorageKey(
            params.accountId,
            params.file.fileName,
        );
        await this.fileStorageService.uploadTaxCard(
            storageKey,
            params.file.buffer,
        );

        const receipt = await this.receiptsRepository.createReceiptFile({
            id: randomUUID(),
            user: { connect: { id: params.userId } },
            account: { connect: { id: params.accountId } },
            fileStorageKey: storageKey,
            status: ReceiptStatus.UPLOADED,
        });

        await this.receiptQueueService.enqueueReceiptProcessing({
            receipt_file_id: receipt.id,
            file_storage_key: storageKey,
        });

        return receipt;
    }

    async getReceipt(
        userId: string,
        accountId: string,
        receiptId: string,
    ): Promise<{
        receipt: ReceiptFile;
        extraction: Awaited<ReturnType<ReceiptsRepository['findExtraction']>>;
    }> {
        await this.assertAccountAccess(userId, accountId);
        const receipt = await this.receiptsRepository.findReceiptById(
            receiptId,
            accountId,
        );
        if (!receipt) {
            throw new NotFoundException('Receipt not found');
        }
        const extraction = await this.receiptsRepository.findExtraction(
            receipt.id,
        );
        return { receipt, extraction };
    }

    async confirmReceipt(
        userId: string,
        accountId: string,
        receiptId: string,
        payload: ConfirmReceiptDto,
    ) {
        const { receipt } = await this.getReceipt(userId, accountId, receiptId);
        const date = new Date(payload.date);
        if (Number.isNaN(date.getTime())) {
            throw new BadRequestException('date must be valid');
        }
        if (typeof payload.amount !== 'number') {
            throw new BadRequestException('amount must be a number');
        }
        if (!payload.categoryId) {
            throw new BadRequestException('categoryId is required');
        }

        const expense = await this.expensesService.createExpense(userId, accountId, {
            taxRegimeId: await this.defaultTaxRegime(accountId),
            occurredAt: date.toISOString(),
            amount: payload.amount,
            currency: payload.currency || 'EUR',
            categoryId: payload.categoryId,
            description: payload.description,
            isDeductible: payload.isDeductible ?? false,
            source: ExpenseSource.RECEIPT,
        });

        await this.receiptsRepository.updateReceiptStatus(
            receipt.id,
            ReceiptStatus.PARSED,
        );

        return expense;
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

    private buildStorageKey(accountId: string, fileName: string): string {
        const safeName = fileName.replace(/\s+/g, '_');
        return `receipts/${accountId}/${randomUUID()}-${safeName}`;
    }

    private async defaultTaxRegime(accountId: string): Promise<string> {
        const profile = await this.prisma.userTaxProfile.findFirst({
            where: { accountId },
            orderBy: { createdAt: 'desc' },
        });
        if (!profile) {
            throw new BadRequestException(
                'No tax profile found to attach receipt expense',
            );
        }
        return profile.taxRegimeId;
    }
}
