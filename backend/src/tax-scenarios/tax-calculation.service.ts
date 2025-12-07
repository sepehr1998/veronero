import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TaxScenarioInputDto } from './dto/tax-scenario-input.dto';

export interface TaxCalculationResult {
    taxableIncome: Prisma.Decimal;
    estimatedTax: Prisma.Decimal;
    netIncome: Prisma.Decimal;
    breakdown: Record<string, unknown>;
}

export type TaxCalculationStrategy = (
    inputs: TaxScenarioInputDto,
) => TaxCalculationResult;

@Injectable()
export class TaxCalculationService {
    private readonly strategies: Map<string, TaxCalculationStrategy> =
        new Map();

    constructor() {
        // Default strategy for all regimes for now.
        this.strategies.set('default', this.defaultStrategy);
    }

    registerStrategy(regimeId: string, strategy: TaxCalculationStrategy): void {
        this.strategies.set(regimeId, strategy);
    }

    calculate(
        taxRegimeId: string,
        inputs: TaxScenarioInputDto,
    ): TaxCalculationResult {
        const strategy =
            this.strategies.get(taxRegimeId) ??
            this.strategies.get('default') ??
            this.defaultStrategy;
        return strategy(inputs);
    }

    private defaultStrategy(inputs: TaxScenarioInputDto): TaxCalculationResult {
        const income = this.sumNumeric(inputs.incomeJson);
        const deductions = this.sumNumeric(inputs.deductionsJson);
        const taxableIncome = Math.max(0, income - deductions);
        const estimatedTax = taxableIncome * 0.25; // placeholder flat rate
        const netIncome = income - estimatedTax;

        return {
            taxableIncome: new Prisma.Decimal(taxableIncome),
            estimatedTax: new Prisma.Decimal(estimatedTax),
            netIncome: new Prisma.Decimal(netIncome),
            breakdown: {
                income,
                deductions,
                effectiveRate: income > 0 ? estimatedTax / income : 0,
            },
        };
    }

    private sumNumeric(obj: Record<string, unknown> | undefined): number {
        if (!obj || typeof obj !== 'object') {
            return 0;
        }
        return (Object.values(obj) as unknown[]).reduce<number>(
            (acc, value) => {
                const numeric =
                    typeof value === 'number' && !Number.isNaN(value)
                        ? value
                        : 0;
                return acc + numeric;
            },
            0,
        );
    }
}
