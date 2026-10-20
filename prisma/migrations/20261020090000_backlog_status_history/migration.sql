ALTER TABLE "Initiative" ADD COLUMN "backlogStatus" TEXT NOT NULL DEFAULT '';

CREATE TABLE "InitiativeStatusEntry" (
    "id" TEXT NOT NULL,
    "initiativeId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InitiativeStatusEntry_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "InitiativeStatusEntry_initiativeId_createdAt_idx" ON "InitiativeStatusEntry"("initiativeId", "createdAt");

ALTER TABLE "InitiativeStatusEntry" ADD CONSTRAINT "InitiativeStatusEntry_initiativeId_fkey" FOREIGN KEY ("initiativeId") REFERENCES "Initiative"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Preserve the audit timeline even if an application accidentally tries to modify it.
CREATE FUNCTION prevent_initiative_status_history_changes() RETURNS trigger AS $$
BEGIN
    RAISE EXCEPTION 'Status history entries cannot be changed or deleted';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER initiative_status_history_append_only
BEFORE UPDATE OR DELETE ON "InitiativeStatusEntry"
FOR EACH ROW EXECUTE FUNCTION prevent_initiative_status_history_changes();
