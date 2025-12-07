import { ExpenseSource } from '@prisma/client';

export class CreateExpenseDto {
    taxRegimeId!: string;
    occurredAt!: string;
    amount!: number;
    currency!: string;
    categoryId!: string;
    description?: string;
    isDeductible = false;
    source: ExpenseSource = ExpenseSource.MANUAL;
}
