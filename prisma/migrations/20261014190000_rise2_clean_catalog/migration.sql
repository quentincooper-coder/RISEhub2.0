-- RISE Hub 2.0 ONLY: replace historic migration seed data with the requested clean catalog.
-- Safety guard: abort rather than delete any operational/user-generated data.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "Task") OR EXISTS (SELECT 1 FROM "Meeting")
    OR EXISTS (SELECT 1 FROM "Risk") OR EXISTS (SELECT 1 FROM "Document")
    OR EXISTS (SELECT 1 FROM "Note") OR EXISTS (SELECT 1 FROM "Contact")
    OR EXISTS (SELECT 1 FROM "MarketContact") OR EXISTS (SELECT 1 FROM "InitiativeContact")
    OR EXISTS (SELECT 1 FROM "MarketInitiativeComment") OR EXISTS (SELECT 1 FROM "Activity")
  THEN
    RAISE EXCEPTION 'Catalog reset aborted: operational data exists. No records were changed.';
  END IF;
END $$;

-- Align legacy nullability with current Prisma schema.
ALTER TABLE "Initiative" ALTER COLUMN "startDate" DROP NOT NULL;
ALTER TABLE "Initiative" ALTER COLUMN "targetDate" DROP NOT NULL;

DELETE FROM "MarketInitiative";
DELETE FROM "Initiative";
DELETE FROM "Market";

INSERT INTO "Market" ("id","name","code","region","lead","status","createdAt","updatedAt") VALUES
('rise2-market-at', 'Austria', 'AT', '', '', 'ON_TRACK', NOW(), NOW()),
('rise2-market-be', 'Belgium', 'BE', '', '', 'ON_TRACK', NOW(), NOW()),
('rise2-market-cz', 'Czech Republic', 'CZ', '', '', 'ON_TRACK', NOW(), NOW()),
('rise2-market-fr', 'France', 'FR', '', '', 'ON_TRACK', NOW(), NOW()),
('rise2-market-de', 'Germany', 'DE', '', '', 'ON_TRACK', NOW(), NOW()),
('rise2-market-ie', 'Ireland', 'IE', '', '', 'ON_TRACK', NOW(), NOW()),
('rise2-market-it', 'Italy', 'IT', '', '', 'ON_TRACK', NOW(), NOW()),
('rise2-market-nl', 'Netherlands', 'NL', '', '', 'ON_TRACK', NOW(), NOW()),
('rise2-market-pl', 'Poland', 'PL', '', '', 'ON_TRACK', NOW(), NOW()),
('rise2-market-sk', 'Slovakia', 'SK', '', '', 'ON_TRACK', NOW(), NOW()),
('rise2-market-es', 'Spain', 'ES', '', '', 'ON_TRACK', NOW(), NOW()),
('rise2-market-se', 'Sweden', 'SE', '', '', 'ON_TRACK', NOW(), NOW()),
('rise2-market-uk', 'United Kingdom', 'UK', '', '', 'ON_TRACK', NOW(), NOW());

INSERT INTO "Initiative" ("id","code","name","description","owner","status","progress","createdAt","updatedAt") VALUES
('rise2-initiative-01', 'R2-01', 'Aftersales - Personnel', '', '', 'ON_TRACK', 0, NOW(), NOW()),
('rise2-initiative-02', 'R2-02', 'Aftersales Processes', '', '', 'ON_TRACK', 0, NOW(), NOW()),
('rise2-initiative-03', 'R2-03', 'Automated Stock Advertising', '', '', 'ON_TRACK', 0, NOW(), NOW()),
('rise2-initiative-04', 'R2-04', 'Aftersales - GDAS', '', '', 'ON_TRACK', 0, NOW(), NOW()),
('rise2-initiative-05', 'R2-05', 'Customer Offer Creator', '', '', 'ON_TRACK', 0, NOW(), NOW()),
('rise2-initiative-06', 'R2-06', 'AI-trade-in price checker', '', '', 'ON_TRACK', 0, NOW(), NOW()),
('rise2-initiative-07', 'R2-07', 'AI vehicle check-in at service point', '', '', 'ON_TRACK', 0, NOW(), NOW()),
('rise2-initiative-08', 'R2-08', 'Used Car Growth Strategy', '', '', 'ON_TRACK', 0, NOW(), NOW()),
('rise2-initiative-09', 'R2-09', 'Refurbishment & Revitalization', '', '', 'ON_TRACK', 0, NOW(), NOW()),
('rise2-initiative-10', 'R2-10', 'Additional Business: UC in Showroom', '', '', 'ON_TRACK', 0, NOW(), NOW()),
('rise2-initiative-11', 'R2-11', 'SKODA Rent', '', '', 'ON_TRACK', 0, NOW(), NOW()),
('rise2-initiative-12', 'R2-12', 'Additional Business: Shop-in-Shop', '', '', 'ON_TRACK', 0, NOW(), NOW()),
('rise2-initiative-13', 'R2-13', 'Change flexibility & upselling (next KAP)', '', '', 'ON_TRACK', 0, NOW(), NOW()),
('rise2-initiative-14', 'R2-14', 'Human Touch | People Excellence Hire', '', '', 'ON_TRACK', 0, NOW(), NOW()),
('rise2-initiative-15', 'R2-15', 'Business Excellence', '', '', 'ON_TRACK', 0, NOW(), NOW()),
('rise2-initiative-16', 'R2-16', 'Digital at Retail | AI Campaign Studio', '', '', 'ON_TRACK', 0, NOW(), NOW()),
('rise2-initiative-17', 'R2-17', 'Dealer Website', '', '', 'ON_TRACK', 0, NOW(), NOW()),
('rise2-initiative-18', 'R2-18', 'Retail Sales Standard Reductions', '', '', 'ON_TRACK', 0, NOW(), NOW()),
('rise2-initiative-19', 'R2-19', 'Capacity Planning Tool', '', '', 'ON_TRACK', 0, NOW(), NOW()),
('rise2-initiative-20', 'R2-20', 'Aftersales formats (service factory)', '', '', 'ON_TRACK', 0, NOW(), NOW()),
('rise2-initiative-21', 'R2-21', 'Hub & Satellite in Sales', '', '', 'ON_TRACK', 0, NOW(), NOW()),
('rise2-initiative-22', 'R2-22', 'Green Retail', '', '', 'ON_TRACK', 0, NOW(), NOW()),
('rise2-initiative-23', 'R2-23', 'AI Inbound & Outbound Calls', '', '', 'ON_TRACK', 0, NOW(), NOW());
