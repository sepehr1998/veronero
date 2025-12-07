import { Injectable } from '@nestjs/common';
import { Prisma, Expense } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

export interface ExpenseFilters {
    from?: Date;
    to?: Date;
    categoryId?: string;
    source?: string;
    isDeductible?: boolean;
}

@Injectable()
export class ExpensesRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: Prisma.ExpenseCreateInput): Promise<Expense> {
        return this.prisma.expense.create({ data });
    }

    async findById(id: string, accountId: string): Promise<Expense | null> {
        return this.prisma.expense.findFirst({
            where: { id, accountId },
        });
    }

    async listByAccount(params: {
        accountId: string;
        skip: number;
        take: number;
        filters: ExpenseFilters;
    }): Promise<{ items: Expense[]; total: number }> {
        const where = this.buildWhere(params.accountId, params.filters);
        const [items, total] = await this.prisma.$transaction([
            this.prisma.expense.findMany({
                where,
                orderBy: { occurredAt: 'desc' },
                skip: params.skip,
                take: params.take,
            }),
            this.prisma.expense.count({ where }),
        ]);
        return { items, total };
    }

    async updateById(
        id: string,
        accountId: string,
        data: Prisma.ExpenseUpdateInput,
    ): Promise<Expense | null> {
        const updated = await this.prisma.expense.updateMany({
            where: { id, accountId },
            data,
        });
        if (updated.count === 0) {
            return null;
        }
        return this.findById(id, accountId);
    }

    async deleteById(id: string, accountId: string): Promise<void> {
        await this.prisma.expense.deleteMany({ where: { id, accountId } });
    }

    async aggregateByCategory(accountId: string, filters: ExpenseFilters) {
        const where = this.buildWhere(accountId, filters);
        return this.prisma.expense.groupBy({
            by: ['categoryId'],
            where,
            _sum: { amount: true },
        });
    }

    async aggregateByMonth(accountId: string, filters: ExpenseFilters) {
        const conditions: Prisma.Sql[] = [Prisma.sql`account_id = ${accountId}`];

        if (filters.from) {
            conditions.push(Prisma.sql`occurred_at >= ${filters.from}`);
        }
        if (filters.to) {
            conditions.push(Prisma.sql`occurred_at <= ${filters.to}`);
        }
        if (filters.categoryId) {
            conditions.push(Prisma.sql`category_id = ${filters.categoryId}`);
        }
        if (filters.source) {
            conditions.push(Prisma.sql`source = ${filters.source}`);
        }
        if (filters.isDeductible !== undefined) {
            conditions.push(
                Prisma.sql`is_deductible = ${filters.isDeductible}`,
            );
        }

        const whereClause =
            conditions.length > 0
                ? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`
                : Prisma.empty;

        return this.prisma.$queryRaw<{ month: string; total: Prisma.Decimal }[]>`
            SELECT to_char(date_trunc('month', occurred_at), 'YYYY-MM') AS month,
                   SUM(amount) AS total
            FROM expenses
            ${whereClause}
            GROUP BY date_trunc('month', occurred_at)
            ORDER BY date_trunc('month', occurred_at) DESC
        `;
    }

    private buildWhere(
        accountId: string,
        filters: ExpenseFilters,
    ): Prisma.ExpenseWhereInput {
        return {
            accountId,
            ...(filters.from || filters.to
                ? {
                      occurredAt: {
                          gte: filters.from,
                          lte: filters.to,
                      },
                  }
                : null),
            ...(filters.categoryId ? { categoryId: filters.categoryId } : null),
            ...(filters.source ? { source: filters.source as any } : null),
            ...(filters.isDeductible !== undefined
                ? { isDeductible: filters.isDeductible }
                : null),
        };
    }
}
