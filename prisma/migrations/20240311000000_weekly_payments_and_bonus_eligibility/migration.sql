-- Rename columns in Package table
ALTER TABLE "Package" RENAME COLUMN "tenorMonths" TO "tenorWeeks";
ALTER TABLE "Package" RENAME COLUMN "monthlyAmount" TO "weeklyAmount";

-- Rename columns in Transaction table
ALTER TABLE "Transaction" RENAME COLUMN "tenorMonths" TO "tenorWeeks";
ALTER TABLE "Transaction" RENAME COLUMN "monthlyAmount" TO "weeklyAmount";

-- Add new columns
ALTER TABLE "Transaction" ADD COLUMN "isBonusEligible" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Payment" ADD COLUMN "isLate" BOOLEAN NOT NULL DEFAULT false;

