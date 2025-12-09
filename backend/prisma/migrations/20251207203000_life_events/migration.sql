-- CreateTable
CREATE TABLE "life_event_types" (
    "id" UUID NOT NULL,
    "tax_regime_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "description" TEXT,
    "questions_schema_json" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "life_event_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_life_events" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "life_event_type_id" UUID NOT NULL,
    "answers_json" JSONB NOT NULL,
    "occurred_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_life_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "life_event_types_tax_regime_id_code_key" ON "life_event_types"("tax_regime_id", "code");

-- CreateIndex
CREATE INDEX "user_life_events_account_id_occurred_at_idx" ON "user_life_events"("account_id", "occurred_at");

-- AddForeignKey
ALTER TABLE "life_event_types" ADD CONSTRAINT "life_event_types_tax_regime_id_fkey" FOREIGN KEY ("tax_regime_id") REFERENCES "tax_regimes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_life_events" ADD CONSTRAINT "user_life_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_life_events" ADD CONSTRAINT "user_life_events_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_life_events" ADD CONSTRAINT "user_life_events_life_event_type_id_fkey" FOREIGN KEY ("life_event_type_id") REFERENCES "life_event_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
