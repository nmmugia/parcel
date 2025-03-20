-- Update the default value for Payment status
ALTER TABLE "Payment" ALTER COLUMN "status" SET DEFAULT 'WAITING_FOR_PAYMENT';

-- Update any existing PENDING statuses to WAITING_FOR_PAYMENT
UPDATE "Payment" SET "status" = 'WAITING_FOR_PAYMENT' WHERE "status" = 'PENDING';

