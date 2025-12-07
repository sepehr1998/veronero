import { Injectable, Logger } from '@nestjs/common';

export interface AiTaxCardParsedPayload {
    sourceJson: Record<string, unknown>;
    withholdingPercentage: number;
    secondaryWithholdingPercentage?: number | null;
    incomeLimit: number;
    validFrom: Date;
    validTo?: Date | null;
    otherFieldsJson?: Record<string, unknown>;
}

export interface AiTaxCardAnalysisPayload {
    aiSummaryText: string;
    keyPointsJson: Record<string, unknown>;
    recommendationsJson: Record<string, unknown>;
}

export interface AiTaxCardResult {
    parsed: AiTaxCardParsedPayload;
    analysis: AiTaxCardAnalysisPayload;
}

@Injectable()
export class AiTaxCardService {
    private readonly logger = new Logger(AiTaxCardService.name);

    async parseTaxCard(file: Buffer): Promise<AiTaxCardResult> {
        // Placeholder stub. Replace with call to external AI/OCR service.
        this.logger.debug(
            `Stub parsing tax card buffer of length ${file.byteLength}`,
        );

        const now = new Date();
        return {
            parsed: {
                sourceJson: { extractedFrom: 'stub', length: file.byteLength },
                withholdingPercentage: 20,
                secondaryWithholdingPercentage: null,
                incomeLimit: 50000,
                validFrom: now,
                validTo: null,
                otherFieldsJson: { note: 'stubbed values' },
            },
            analysis: {
                aiSummaryText: 'Stub AI summary of the tax card contents.',
                keyPointsJson: {
                    withholding: '20%',
                    incomeLimit: 50000,
                },
                recommendationsJson: {
                    nextSteps: ['Verify data against official records'],
                },
            },
        };
    }
}
