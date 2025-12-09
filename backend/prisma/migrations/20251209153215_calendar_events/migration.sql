-- CreateEnum
CREATE TYPE "LifeEventStatus" AS ENUM ('active', 'inactive');

-- DropForeignKey
ALTER TABLE "calendar_events" DROP CONSTRAINT "calendar_events_template_id_fkey";

-- AlterTable
ALTER TABLE "expenses" ALTER COLUMN "amount" SET DATA TYPE DECIMAL;

-- AddForeignKey
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "calendar_event_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;
