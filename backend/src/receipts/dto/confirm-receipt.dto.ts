export class ConfirmReceiptDto {
    date!: string;
    amount!: number;
    currency?: string;
    categoryId!: string;
    description?: string;
    isDeductible?: boolean;
}
