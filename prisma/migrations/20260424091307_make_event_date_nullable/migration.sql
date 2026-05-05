-- AlterTable
ALTER TABLE "event_rsvps" ALTER COLUMN "invite_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "events" ALTER COLUMN "event_date" DROP NOT NULL;
