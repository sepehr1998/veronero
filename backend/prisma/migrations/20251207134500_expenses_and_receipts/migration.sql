-- CreateEnum
CREATE TYPE "ExpenseSource" AS ENUM ('manual', 'receipt');

-- CreateEnum
CREATE TYPE "ReceiptStatus" AS ENUM ('uploaded', 'processing', 'parsed', 'error');

-- CreateTable
CREATE TABLE "expense_categories" (
    "id" UUID NOT NULL,
    "tax_regime_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "expense_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expenses" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "tax_regime_id" UUID NOT NULL,
    "occurred_at" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL,
    "category_id" UUID NOT NULL,
    "description" TEXT,
    "is_deductible" BOOLEAN NOT NULL,
    "source" "ExpenseSource" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receipt_files" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "file_storage_key" TEXT NOT NULL,
    "status" "ReceiptStatus" NOT NULL DEFAULT 'uploaded',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "receipt_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receipt_extractions" (
    "id" UUID NOT NULL,
    "receipt_file_id" UUID NOT NULL,
    "extracted_json" JSONB NOT NULL,
    "suggested_amount" DECIMAL(65,30) NOT NULL,
    "suggested_date" TIMESTAMP(3) NOT NULL,
    "suggested_category_id" UUID,
    "confidence_score" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "receipt_extractions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "expense_categories_tax_regime_id_code_key" ON "expense_categories"("tax_regime_id", "code");

-- CreateIndex
CREATE INDEX "expenses_account_id_occurred_at_idx" ON "expenses"("account_id", "occurred_at");

-- CreateIndex
CREATE UNIQUE INDEX "receipt_extractions_receipt_file_id_key" ON "receipt_extractions"("receipt_file_id");

-- AddForeignKey
ALTER TABLE "expense_categories" ADD CONSTRAINT "expense_categories_tax_regime_id_fkey" FOREIGN KEY ("tax_regime_id") REFERENCES "tax_regimes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_tax_regime_id_fkey" FOREIGN KEY ("tax_regime_id") REFERENCES "tax_regimes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "expense_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipt_files" ADD CONSTRAINT "receipt_files_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipt_files" ADD CONSTRAINT "receipt_files_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipt_extractions" ADD CONSTRAINT "receipt_extractions_receipt_file_id_fkey" FOREIGN KEY ("receipt_file_id") REFERENCES "receipt_files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipt_extractions" ADD CONSTRAINT "receipt_extractions_suggested_category_id_fkey" FOREIGN KEY ("suggested_category_id") REFERENCES "expense_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
