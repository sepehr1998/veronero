import { TaxScenarioInputDto } from './tax-scenario-input.dto';

export class UpdateTaxScenarioDto {
    name?: string;
    description?: string | null;
    taxRegimeId?: string;
    basedOnTaxCardId?: string | null;
    basedOnProfileId?: string | null;
    inputs?: TaxScenarioInputDto;
}
