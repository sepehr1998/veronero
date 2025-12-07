import { ExpenseSource } from '@prisma/client';

export class UpdateExpenseDto {
    taxRegimeId?: string;
    occurredAt?: string;
    amount?: number;
    currency?: string;
    categoryId?: string;
    description?: string | null;
    isDeductible?: boolean;
    source?: ExpenseSource;
}
