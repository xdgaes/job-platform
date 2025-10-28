-- Migration: Add dual role system
-- This migration updates the User table to support Clipper and Creator roles

-- Step 1: Add the new currentRole column with default value
ALTER TABLE "User" ADD COLUMN "currentRole" TEXT NOT NULL DEFAULT 'clipper';

-- Step 2: Migrate existing data (if role column exists)
-- Update users with 'provider' role to 'creator'
UPDATE "User" SET "currentRole" = 'creator' WHERE "role" = 'provider';

-- Update users with 'applicant' role to 'clipper'
UPDATE "User" SET "currentRole" = 'clipper' WHERE "role" = 'applicant';

-- Step 3: Drop the old role column (optional - only if you want to clean up)
-- ALTER TABLE "User" DROP COLUMN IF EXISTS "role";

-- Add comment for documentation
COMMENT ON COLUMN "User"."currentRole" IS 'Current active role: clipper or creator. Users can switch between roles.';
