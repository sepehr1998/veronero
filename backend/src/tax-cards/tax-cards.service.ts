import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    TaxCard,
    TaxCardStatus,
    TaxRegime,
    Account,
    TaxCardParsed,
    TaxCardAnalysis,
    Prisma,
} from '@prisma/client';
import { randomUUID } from 'crypto';
import { basename, join } from 'path';
import type { Readable } from 'stream';
import { PrismaService } from '../database/prisma.service';
import { FileStorageService } from '../storage/file-storage.service';
import { TaxCardsRepository } from './tax-cards.repository';
import { TaxCardQueueService } from './tax-card-queue.service';

export interface TaxCardResponse {
    id: string;
    userId: string;
    accountId: string;
    taxRegimeId: string;
    fileStorageKey: string;
    status: TaxCardStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface TaxCardParsedResponse {
    sourceJson: Prisma.JsonValue;
    withholdingPercentage: string;
    secondaryWithholdingPercentage: string | null;
    incomeLimit: string;
    validFrom: Date;
    validTo: Date | null;
    otherFieldsJson: Prisma.JsonValue;
}

export interface TaxCardAnalysisResponse {
    id: string;
    taxCardId: string;
    aiSummaryText: string;
    keyPointsJson: Prisma.JsonValue;
    recommendationsJson: Prisma.JsonValue;
    createdAt: Date;
}

export interface TaxCardDetailResponse extends TaxCardResponse {
    parsed: TaxCardParsedResponse | null;
    analyses: TaxCardAnalysisResponse[];
}

export interface UploadTaxCardFile {
    fileName: string;
    buffer: Buffer | Readable;
}

export interface TaxCardFileStream {
    stream: NodeJS.ReadableStream;
    fileName: string;
}

@Injectable()
export class TaxCardsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly taxCardsRepository: TaxCardsRepository,
        private readonly fileStorageService: FileStorageService,
        private readonly taxCardQueueService: TaxCardQueueService,
    ) {}

    async uploadTaxCard(params: {
        userId: string;
        accountId: string;
        taxRegimeId: string;
        file: UploadTaxCardFile;
    }): Promise<TaxCardResponse> {
        const account = await this.assertAccountAccess(
            params.userId,
            params.accountId,
        );
        const taxRegime = await this.validateTaxRegime(
            params.taxRegimeId,
            account.countryCode,
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

        const taxCard = await this.taxCardsRepository.create({
            id: randomUUID(),
            user: { connect: { id: params.userId } },
            account: { connect: { id: params.accountId } },
            taxRegime: { connect: { id: taxRegime.id } },
            fileStorageKey: storageKey,
            status: TaxCardStatus.UPLOADED,
        });

        await this.taxCardQueueService.enqueueProcessTaxCard({
            tax_card_id: taxCard.id,
            file_storage_key: storageKey,
        });

        return this.mapTaxCard(taxCard);
    }

    async listTaxCardsForAccount(
        userId: string,
        accountId: string,
    ): Promise<TaxCardResponse[]> {
        await this.assertAccountAccess(userId, accountId);
        const taxCards = await this.taxCardsRepository.listByAccount(accountId);
        return taxCards.map((card) => this.mapTaxCard(card));
    }

    async getTaxCardWithParsed(
        userId: string,
        taxCardId: string,
    ): Promise<TaxCardDetailResponse> {
        const taxCard = await this.taxCardsRepository.findDetailedAccessibleById(
            taxCardId,
            userId,
        );

        if (!taxCard) {
            throw new NotFoundException('Tax card not found');
        }

        return this.mapTaxCardDetail(taxCard);
    }

    async getLatestAnalysis(
        userId: string,
        taxCardId: string,
    ): Promise<TaxCardAnalysisResponse | null> {
        const taxCard = await this.taxCardsRepository.findAccessibleById(
            taxCardId,
            userId,
        );

        if (!taxCard) {
            throw new NotFoundException('Tax card not found');
        }

        const analysis =
            await this.taxCardsRepository.findLatestAnalysis(taxCardId, userId);

        return analysis ? this.mapTaxCardAnalysis(analysis) : null;
    }

    async getTaxCardFileStream(
        userId: string,
        taxCardId: string,
    ): Promise<TaxCardFileStream> {
        const taxCard = await this.taxCardsRepository.findAccessibleById(
            taxCardId,
            userId,
        );

        if (!taxCard) {
            throw new NotFoundException('Tax card not found');
        }

        const stream = await this.fileStorageService.getTaxCardStream(
            taxCard.fileStorageKey,
        );

        return {
            stream,
            fileName: basename(taxCard.fileStorageKey),
        };
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
            throw new NotFoundException('Account not found for current user');
        }

        return membership.account;
    }

    private async validateTaxRegime(
        taxRegimeId: string,
        countryCode?: string,
    ): Promise<TaxRegime> {
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

        return taxRegime;
    }

    private buildStorageKey(accountId: string, fileName: string): string {
        const safeName = fileName.replace(/\s+/g, '_');
        return join('tax-cards', accountId, `${randomUUID()}-${safeName}`);
    }

    private mapTaxCard(taxCard: TaxCard): TaxCardResponse {
        return {
            id: taxCard.id,
            userId: taxCard.userId,
            accountId: taxCard.accountId,
            taxRegimeId: taxCard.taxRegimeId,
            fileStorageKey: taxCard.fileStorageKey,
            status: taxCard.status,
            createdAt: taxCard.createdAt,
            updatedAt: taxCard.updatedAt,
        };
    }

    private mapTaxCardDetail(
        taxCard: TaxCard & {
            parsed: TaxCardParsed | null;
            analyses: TaxCardAnalysis[];
        },
    ): TaxCardDetailResponse {
        return {
            ...this.mapTaxCard(taxCard),
            parsed: taxCard.parsed
                ? this.mapTaxCardParsed(taxCard.parsed)
                : null,
            analyses: taxCard.analyses.map((analysis) =>
                this.mapTaxCardAnalysis(analysis),
            ),
        };
    }

    private mapTaxCardParsed(
        parsed: TaxCardParsed,
    ): TaxCardParsedResponse {
        return {
            sourceJson: parsed.sourceJson,
            withholdingPercentage: parsed.withholdingPercentage.toString(),
            secondaryWithholdingPercentage:
                parsed.secondaryWithholdingPercentage?.toString() ?? null,
            incomeLimit: parsed.incomeLimit.toString(),
            validFrom: parsed.validFrom,
            validTo: parsed.validTo,
            otherFieldsJson: parsed.otherFieldsJson,
        };
    }

    private mapTaxCardAnalysis(
        analysis: TaxCardAnalysis,
    ): TaxCardAnalysisResponse {
        return {
            id: analysis.id,
            taxCardId: analysis.taxCardId,
            aiSummaryText: analysis.aiSummaryText,
            keyPointsJson: analysis.keyPointsJson,
            recommendationsJson: analysis.recommendationsJson,
            createdAt: analysis.createdAt,
        };
    }
}
