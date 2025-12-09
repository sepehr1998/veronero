-- CreateEnum
CREATE TYPE "TaxScenarioStatus" AS ENUM ('draft', 'final');

-- CreateTable
CREATE TABLE "tax_scenarios" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "tax_regime_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "based_on_tax_card_id" UUID,
    "based_on_profile_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tax_scenarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax_scenario_inputs" (
    "id" UUID NOT NULL,
    "scenario_id" UUID NOT NULL,
    "income_json" JSONB NOT NULL,
    "deductions_json" JSONB NOT NULL,
    "assumptions_json" JSONB NOT NULL,
    "life_events_json" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tax_scenario_inputs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax_scenario_results" (
    "id" UUID NOT NULL,
    "scenario_id" UUID NOT NULL,
    "taxable_income" DECIMAL(65,30) NOT NULL,
    "estimated_tax" DECIMAL(65,30) NOT NULL,
    "net_income" DECIMAL(65,30) NOT NULL,
    "breakdown_json" JSONB NOT NULL,
    "comparisons_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tax_scenario_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax_scenario_recommendations" (
    "id" UUID NOT NULL,
    "scenario_id" UUID NOT NULL,
    "ai_summary_text" TEXT NOT NULL,
    "recommendations_json" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tax_scenario_recommendations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tax_scenarios" ADD CONSTRAINT "tax_scenarios_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_scenarios" ADD CONSTRAINT "tax_scenarios_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_scenarios" ADD CONSTRAINT "tax_scenarios_tax_regime_id_fkey" FOREIGN KEY ("tax_regime_id") REFERENCES "tax_regimes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_scenarios" ADD CONSTRAINT "tax_scenarios_based_on_tax_card_id_fkey" FOREIGN KEY ("based_on_tax_card_id") REFERENCES "tax_cards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_scenarios" ADD CONSTRAINT "tax_scenarios_based_on_profile_id_fkey" FOREIGN KEY ("based_on_profile_id") REFERENCES "user_tax_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_scenario_inputs" ADD CONSTRAINT "tax_scenario_inputs_scenario_id_fkey" FOREIGN KEY ("scenario_id") REFERENCES "tax_scenarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_scenario_results" ADD CONSTRAINT "tax_scenario_results_scenario_id_fkey" FOREIGN KEY ("scenario_id") REFERENCES "tax_scenarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_scenario_recommendations" ADD CONSTRAINT "tax_scenario_recommendations_scenario_id_fkey" FOREIGN KEY ("scenario_id") REFERENCES "tax_scenarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
