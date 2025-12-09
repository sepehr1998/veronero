-- CreateEnum
CREATE TYPE "CalendarEventStatus" AS ENUM ('upcoming', 'completed', 'dismissed');

-- CreateTable
CREATE TABLE "calendar_event_templates" (
    "id" UUID NOT NULL,
    "tax_regime_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "rule_json" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "calendar_event_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calendar_events" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "template_id" UUID,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,
    "status" "CalendarEventStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "calendar_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "calendar_event_templates_tax_regime_id_code_key" ON "calendar_event_templates"("tax_regime_id", "code");

-- CreateIndex
CREATE INDEX "calendar_events_account_id_start_at_idx" ON "calendar_events"("account_id", "start_at");

-- AddForeignKey
ALTER TABLE "calendar_event_templates" ADD CONSTRAINT "calendar_event_templates_tax_regime_id_fkey" FOREIGN KEY ("tax_regime_id") REFERENCES "tax_regimes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "calendar_event_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
