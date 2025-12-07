import { ExpenseSource } from '@prisma/client';

export class ListExpensesDto {
    page?: number;
    pageSize?: number;
    from?: string;
    to?: string;
    categoryId?: string;
    source?: ExpenseSource;
    isDeductible?: boolean;
    groupBy?: 'category' | 'month';
}
