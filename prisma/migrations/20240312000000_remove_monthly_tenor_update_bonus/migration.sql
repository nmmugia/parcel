-- Remove monthly tenor fields and update bonus system
ALTER TABLE "Package" DROP COLUMN IF EXISTS "tenorMonths";
ALTER TABLE "Package" DROP COLUMN IF EXISTS "monthlyAmount";

ALTER TABLE "Transaction" DROP COLUMN IF EXISTS "tenorMonths";
ALTER TABLE "Transaction" DROP COLUMN IF EXISTS "monthlyAmount";

-- Remove percentage-based bonus fields
ALTER TABLE "Payment" DROP COLUMN IF EXISTS "resellerBonusRate";
ALTER TABLE "Payment" DROP COLUMN IF EXISTS "adminBonusRate";

-- Add fixed bonus amount field
ALTER TABLE "Transaction" ADD COLUMN IF NOT EXISTS "bonusAmount" DECIMAL(65,30);

-- Add late payment tracking
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "isLate" BOOLEAN NOT NULL DEFAULT false;

-- Add bonus eligibility to transaction
ALTER TABLE "Transaction" ADD COLUMN IF NOT EXISTS "isBonusEligible" BOOLEAN NOT NULL DEFAULT true;

-- Drop the bonus_rates setting if it exists
DELETE FROM "Setting" WHERE key = 'bonus_rates';

