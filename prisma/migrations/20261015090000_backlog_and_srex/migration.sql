ALTER TABLE "Initiative" ADD COLUMN IF NOT EXISTS "isReleased" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Initiative" ADD COLUMN IF NOT EXISTS "releasedAt" TIMESTAMP(3);
CREATE TABLE IF NOT EXISTS "BacklogData" ("initiativeId" TEXT NOT NULL PRIMARY KEY, "fields" JSONB NOT NULL DEFAULT '{}'::jsonb);
CREATE TABLE IF NOT EXISTS "SrexData" ("initiativeId" TEXT NOT NULL PRIMARY KEY, "fields" JSONB NOT NULL DEFAULT '{}'::jsonb);
DO $$ BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'BacklogData_initiativeId_fkey') THEN
  ALTER TABLE "BacklogData" ADD CONSTRAINT "BacklogData_initiativeId_fkey" FOREIGN KEY ("initiativeId") REFERENCES "Initiative"("id") ON DELETE CASCADE ON UPDATE CASCADE;
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SrexData_initiativeId_fkey') THEN
  ALTER TABLE "SrexData" ADD CONSTRAINT "SrexData_initiativeId_fkey" FOREIGN KEY ("initiativeId") REFERENCES "Initiative"("id") ON DELETE CASCADE ON UPDATE CASCADE;
 END IF;
END $$;
