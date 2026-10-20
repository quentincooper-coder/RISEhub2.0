-- Initiative-wide notes have no market association. The original Note migration
-- required marketId, although the current Prisma model makes it optional.
-- This is a nullability-only correction; no existing notes or other data change.
ALTER TABLE "Note" ALTER COLUMN "marketId" DROP NOT NULL;
