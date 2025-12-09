-- CreateEnum
CREATE TYPE "TaxCardStatus" AS ENUM ('uploaded', 'processing', 'parsed', 'error');

-- CreateTable
CREATE TABLE "tax_cards" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "tax_regime_id" UUID NOT NULL,
    "file_storage_key" TEXT NOT NULL,
    "status" "TaxCardStatus" NOT NULL DEFAULT 'uploaded',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tax_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax_card_parsed" (
    "id" UUID NOT NULL,
    "tax_card_id" UUID NOT NULL,
    "source_json" JSONB NOT NULL,
    "withholding_percentage" DECIMAL(65,30) NOT NULL,
    "secondary_withholding_percentage" DECIMAL(65,30),
    "income_limit" DECIMAL(65,30) NOT NULL,
    "valid_from" TIMESTAMP(3) NOT NULL,
    "valid_to" TIMESTAMP(3),
    "other_fields_json" JSONB NOT NULL,

    CONSTRAINT "tax_card_parsed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax_card_analyses" (
    "id" UUID NOT NULL,
    "tax_card_id" UUID NOT NULL,
    "ai_summary_text" TEXT NOT NULL,
    "key_points_json" JSONB NOT NULL,
    "recommendations_json" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tax_card_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tax_card_parsed_tax_card_id_key" ON "tax_card_parsed"("tax_card_id");

-- CreateIndex
CREATE INDEX "tax_card_analyses_tax_card_id_idx" ON "tax_card_analyses"("tax_card_id");

-- AddForeignKey
ALTER TABLE "tax_cards" ADD CONSTRAINT "tax_cards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_cards" ADD CONSTRAINT "tax_cards_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_cards" ADD CONSTRAINT "tax_cards_tax_regime_id_fkey" FOREIGN KEY ("tax_regime_id") REFERENCES "tax_regimes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_card_parsed" ADD CONSTRAINT "tax_card_parsed_tax_card_id_fkey" FOREIGN KEY ("tax_card_id") REFERENCES "tax_cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_card_analyses" ADD CONSTRAINT "tax_card_analyses_tax_card_id_fkey" FOREIGN KEY ("tax_card_id") REFERENCES "tax_cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
