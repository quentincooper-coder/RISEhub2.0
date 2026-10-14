-- Align Meeting with the current Prisma model. These optional fields were
-- added to schema.prisma but not captured in previous migrations.
ALTER TABLE "Meeting" ADD COLUMN IF NOT EXISTS "participants" TEXT;
ALTER TABLE "Meeting" ADD COLUMN IF NOT EXISTS "location" TEXT;
ALTER TABLE "Meeting" ADD COLUMN IF NOT EXISTS "documentUrl" TEXT;
