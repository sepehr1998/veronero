import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    Account,
    Expense,
    ExpenseCategory,
    ExpenseSource,
    TaxRegime,
} from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ListExpensesDto } from './dto/list-expenses.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpensesRepository } from './expenses.repository';

export interface ExpenseResponse {
    id: string;
    userId: string;
    accountId: string;
    taxRegimeId: string;
    occurredAt: Date;
    amount: string;
    currency: string;
    categoryId: string;
    description: string | null;
    isDeductible: boolean;
    source: ExpenseSource;
    createdAt: Date;
    updatedAt: Date;
}

export interface PaginatedExpensesResponse {
    items: ExpenseResponse[];
    total: number;
    page: number;
    pageSize: number;
    aggregates?: ExpenseAggregates;
}

export interface ExpenseAggregates {
    byCategory?: Array<{
        categoryId: string;
        total: string;
        displayName?: string;
        code?: string;
    }>;
    byMonth?: Array<{
        month: string;
        total: string;
    }>;
}

@Injectable()
export class ExpensesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly expensesRepository: ExpensesRepository,
    ) {}

    async createExpense(
        userId: string,
        accountId: string,
        input: CreateExpenseDto,
    ): Promise<ExpenseResponse> {
        const account = await this.assertAccountAccess(userId, accountId);
        const payload = this.validateCreatePayload(input);

        const category = await this.validateCategory(
            payload.categoryId,
            payload.taxRegimeId,
        );
        const taxRegime = await this.validateTaxRegime(
            payload.taxRegimeId,
            account.countryCode,
        );

        const expense = await this.expensesRepository.create({
            user: { connect: { id: userId } },
            account: { connect: { id: accountId } },
            taxRegime: { connect: { id: taxRegime.id } },
            category: { connect: { id: category.id } },
            occurredAt: payload.occurredAt,
            amount: payload.amount,
            currency: payload.currency,
            description: payload.description ?? null,
            isDeductible: payload.isDeductible,
            source: payload.source ?? ExpenseSource.MANUAL,
        });

        return this.mapExpense(expense);
    }

    async listExpenses(
        userId: string,
        accountId: string,
        query: ListExpensesDto,
    ): Promise<PaginatedExpensesResponse> {
        await this.assertAccountAccess(userId, accountId);
        const { page, pageSize, filters } = this.parseListQuery(query);
        const { items, total } = await this.expensesRepository.listByAccount({
            accountId,
            skip: (page - 1) * pageSize,
            take: pageSize,
            filters,
        });

        const response: PaginatedExpensesResponse = {
            items: items.map((expense) => this.mapExpense(expense)),
            total,
            page,
            pageSize,
        };

        if (query.groupBy === 'category') {
            const aggregates = await this.expensesRepository.aggregateByCategory(
                accountId,
                filters,
            );
            const categoryIds = aggregates
                .map((item) => item.categoryId)
                .filter(Boolean);
            const categories = await this.prisma.expenseCategory.findMany({
                where: { id: { in: categoryIds } },
            });

            response.aggregates = {
                byCategory: aggregates.map((item) => {
                    const category = categories.find(
                        (c) => c.id === item.categoryId,
                    );
                    return {
                        categoryId: item.categoryId,
                        total: item._sum.amount?.toString() ?? '0',
                        displayName: category?.displayName,
                        code: category?.code,
                    };
                }),
            };
        } else if (query.groupBy === 'month') {
            const aggregates = await this.expensesRepository.aggregateByMonth(
                accountId,
                filters,
            );
            response.aggregates = {
                byMonth: aggregates.map((row) => ({
                    month: row.month,
                    total: row.total.toString(),
                })),
            };
        }

        return response;
    }

    async getExpense(
        userId: string,
        accountId: string,
        expenseId: string,
    ): Promise<ExpenseResponse> {
        await this.assertAccountAccess(userId, accountId);
        const expense = await this.expensesRepository.findById(
            expenseId,
            accountId,
        );

        if (!expense) {
            throw new NotFoundException('Expense not found');
        }

        return this.mapExpense(expense);
    }

    async updateExpense(
        userId: string,
        accountId: string,
        expenseId: string,
        input: UpdateExpenseDto,
    ): Promise<ExpenseResponse> {
        const account = await this.assertAccountAccess(userId, accountId);
        const existing = await this.expensesRepository.findById(
            expenseId,
            accountId,
        );
        if (!existing) {
            throw new NotFoundException('Expense not found');
        }

        const payload = this.validateUpdatePayload(input);
        let category: ExpenseCategory | undefined;
        let taxRegimeId = payload.taxRegimeId ?? existing.taxRegimeId;

        if (payload.categoryId) {
            category = await this.validateCategory(
                payload.categoryId,
                taxRegimeId,
            );
        }

        if (payload.taxRegimeId) {
            await this.validateTaxRegime(payload.taxRegimeId, account.countryCode);
            taxRegimeId = payload.taxRegimeId;
        }

        const updated = await this.expensesRepository.updateById(
            expenseId,
            accountId,
            {
                ...(payload.occurredAt
                    ? { occurredAt: payload.occurredAt }
                    : null),
                ...(payload.amount !== undefined
                    ? { amount: payload.amount }
                    : null),
                ...(payload.currency ? { currency: payload.currency } : null),
                ...(payload.description !== undefined
                    ? { description: payload.description }
                    : null),
                ...(payload.isDeductible !== undefined
                    ? { isDeductible: payload.isDeductible }
                    : null),
                ...(payload.source ? { source: payload.source } : null),
                taxRegime: { connect: { id: taxRegimeId } },
                ...(payload.categoryId
                    ? { category: { connect: { id: category?.id } } }
                    : null),
            },
        );

        if (!updated) {
            throw new ForbiddenException('Unable to update expense');
        }

        return this.mapExpense(updated);
    }

    async deleteExpense(
        userId: string,
        accountId: string,
        expenseId: string,
    ): Promise<void> {
        await this.assertAccountAccess(userId, accountId);
        const existing = await this.expensesRepository.findById(
            expenseId,
            accountId,
        );
        if (!existing) {
            throw new NotFoundException('Expense not found');
        }
        await this.expensesRepository.deleteById(expenseId, accountId);
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

    private async validateCategory(
        categoryId: string,
        taxRegimeId: string,
    ): Promise<ExpenseCategory> {
        const category = await this.prisma.expenseCategory.findFirst({
            where: {
                id: categoryId,
                taxRegimeId,
                isActive: true,
            },
        });
        if (!category) {
            throw new NotFoundException('Expense category is not valid');
        }
        return category;
    }

    private validateCreatePayload(input: CreateExpenseDto) {
        if (!input.taxRegimeId) {
            throw new BadRequestException('taxRegimeId is required');
        }
        if (!input.occurredAt || Number.isNaN(Date.parse(input.occurredAt))) {
            throw new BadRequestException('occurredAt must be a valid date');
        }
        if (typeof input.amount !== 'number') {
            throw new BadRequestException('amount must be a number');
        }
        if (!input.currency) {
            throw new BadRequestException('currency is required');
        }
        if (!input.categoryId) {
            throw new BadRequestException('categoryId is required');
        }

        return {
            taxRegimeId: input.taxRegimeId,
            occurredAt: new Date(input.occurredAt),
            amount: input.amount,
            currency: input.currency,
            categoryId: input.categoryId,
            description: input.description,
            isDeductible: Boolean(input.isDeductible),
            source: input.source ?? ExpenseSource.MANUAL,
        };
    }

    private validateUpdatePayload(input: UpdateExpenseDto) {
        if (input.occurredAt && Number.isNaN(Date.parse(input.occurredAt))) {
            throw new BadRequestException('occurredAt must be a valid date');
        }

        if (
            input.amount !== undefined &&
            (typeof input.amount !== 'number' || Number.isNaN(input.amount))
        ) {
            throw new BadRequestException('amount must be a number');
        }

        return {
            taxRegimeId: input.taxRegimeId,
            occurredAt: input.occurredAt
                ? new Date(input.occurredAt)
                : undefined,
            amount: input.amount,
            currency: input.currency,
            categoryId: input.categoryId,
            description:
                input.description === null ? null : input.description ?? undefined,
            isDeductible: input.isDeductible,
            source: input.source,
        };
    }

    private parseListQuery(query: ListExpensesDto): {
        page: number;
        pageSize: number;
        filters: {
            from?: Date;
            to?: Date;
            categoryId?: string;
            source?: string;
            isDeductible?: boolean;
        };
    } {
        const page = Math.max(1, Number(query.page) || 1);
        const pageSize = Math.min(100, Math.max(1, Number(query.pageSize) || 20));

        if (
            query.groupBy &&
            query.groupBy !== 'category' &&
            query.groupBy !== 'month'
        ) {
            throw new BadRequestException('groupBy must be category or month');
        }

        const filters: {
            from?: Date;
            to?: Date;
            categoryId?: string;
            source?: string;
            isDeductible?: boolean;
        } = {};

        if (query.from) {
            const parsed = new Date(query.from);
            if (Number.isNaN(parsed.getTime())) {
                throw new BadRequestException('from must be a valid date');
            }
            filters.from = parsed;
        }

        if (query.to) {
            const parsed = new Date(query.to);
            if (Number.isNaN(parsed.getTime())) {
                throw new BadRequestException('to must be a valid date');
            }
            filters.to = parsed;
        }

        if (query.categoryId) {
            filters.categoryId = query.categoryId;
        }

        if (query.source) {
            if (!Object.values(ExpenseSource).includes(query.source)) {
                throw new BadRequestException('source must be manual or receipt');
            }
            filters.source = query.source;
        }

        if (query.isDeductible !== undefined) {
            const value =
                typeof query.isDeductible === 'string'
                    ? query.isDeductible.toLowerCase()
                    : query.isDeductible;

            if (value === true || value === 'true') {
                filters.isDeductible = true;
            } else if (value === false || value === 'false') {
                filters.isDeductible = false;
            } else {
                throw new BadRequestException('isDeductible must be boolean');
            }
        }

        return { page, pageSize, filters };
    }

    private mapExpense(expense: Expense): ExpenseResponse {
        return {
            id: expense.id,
            userId: expense.userId,
            accountId: expense.accountId,
            taxRegimeId: expense.taxRegimeId,
            occurredAt: expense.occurredAt,
            amount: expense.amount.toString(),
            currency: expense.currency,
            categoryId: expense.categoryId,
            description: expense.description ?? null,
            isDeductible: expense.isDeductible,
            source: expense.source,
            createdAt: expense.createdAt,
            updatedAt: expense.updatedAt,
        };
    }
}
