import { Injectable, Logger } from '@nestjs/common';

export interface AiReceiptResult {
    items: Array<{ description: string; amount: number }>;
    total: number;
    currency?: string;
    date?: string;
    merchant?: string;
    suggestedCategoryId?: string | null;
    confidence?: number;
    sourceJson?: Record<string, unknown>;
}

@Injectable()
export class AiReceiptService {
    private readonly logger = new Logger(AiReceiptService.name);

    async extractReceipt(file: Buffer): Promise<AiReceiptResult> {
        this.logger.debug(
            `Stub extracting receipt buffer of length ${file.byteLength}`,
        );

        return {
            items: [{ description: 'Stub item', amount: 42 }],
            total: 42,
            currency: 'USD',
            sourceJson: { note: 'stubbed receipt' },
        };
    }
}
