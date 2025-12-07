export class TaxScenarioInputDto {
    incomeJson!: Record<string, unknown>;
    deductionsJson!: Record<string, unknown>;
    assumptionsJson?: Record<string, unknown>;
    lifeEventsJson?: Record<string, unknown>;
}
