import { TaxScenarioInputDto } from './tax-scenario-input.dto';

export class CreateTaxScenarioDto {
    name!: string;
    description?: string;
    taxRegimeId!: string;
    basedOnTaxCardId?: string;
    basedOnProfileId?: string;
    inputs?: TaxScenarioInputDto;
}
