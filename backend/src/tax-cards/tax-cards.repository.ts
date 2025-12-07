import { Injectable } from '@nestjs/common';
import {
    Prisma,
    TaxCard,
    TaxCardStatus,
    TaxCardParsed,
    TaxCardAnalysis,
} from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class TaxCardsRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: Prisma.TaxCardCreateInput): Promise<TaxCard> {
        return this.prisma.taxCard.create({ data });
    }

    async listByAccount(accountId: string): Promise<TaxCard[]> {
        return this.prisma.taxCard.findMany({
            where: { accountId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findAccessibleById(
        taxCardId: string,
        userId: string,
    ): Promise<TaxCard | null> {
        return this.prisma.taxCard.findFirst({
            where: {
                id: taxCardId,
                account: {
                    users: {
                        some: { userId },
                    },
                },
            },
        });
    }

    async findDetailedAccessibleById(
        taxCardId: string,
        userId: string,
    ): Promise<
        | (TaxCard & {
              parsed: TaxCardParsed | null;
              analyses: TaxCardAnalysis[];
          })
        | null
    > {
        return this.prisma.taxCard.findFirst({
            where: {
                id: taxCardId,
                account: {
                    users: {
                        some: { userId },
                    },
                },
            },
            include: {
                parsed: true,
                analyses: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
    }

    async findLatestAnalysis(
        taxCardId: string,
        userId: string,
    ): Promise<TaxCardAnalysis | null> {
        return this.prisma.taxCardAnalysis.findFirst({
            where: {
                taxCardId,
                taxCard: {
                    account: {
                        users: { some: { userId } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async updateStatus(
        taxCardId: string,
        status: TaxCardStatus,
    ): Promise<TaxCard> {
        return this.prisma.taxCard.update({
            where: { id: taxCardId },
            data: { status },
        });
    }
}
