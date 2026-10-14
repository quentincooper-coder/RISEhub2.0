-- Synchronize columns present in Prisma schema but absent from historical migrations.
-- Safe and additive: no user data is deleted or modified.
ALTER TABLE "Market" ADD COLUMN IF NOT EXISTS "owner" TEXT;
ALTER TABLE "Initiative" ADD COLUMN IF NOT EXISTS "stage" TEXT NOT NULL DEFAULT 'IDEATION';
ALTER TABLE "Initiative" ADD COLUMN IF NOT EXISTS "keyKpis" TEXT;
-- The Prisma schema allows initiatives without an explicit code.
ALTER TABLE "Initiative" ALTER COLUMN "code" DROP NOT NULL;
