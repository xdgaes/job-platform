-- AlterTable
ALTER TABLE "Campaign"
ADD COLUMN     "title" TEXT NOT NULL DEFAULT '';

ALTER TABLE "Campaign"
ADD COLUMN     "videoLink" TEXT;

ALTER TABLE "Campaign"
ADD COLUMN     "flatBudgetAmount" DOUBLE PRECISION NOT NULL DEFAULT 0;

ALTER TABLE "Campaign"
ADD COLUMN     "flatBudgetViews" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "Campaign"
ADD COLUMN     "performanceBudgetAmount" DOUBLE PRECISION NOT NULL DEFAULT 0;

ALTER TABLE "Campaign"
ADD COLUMN     "performanceBudgetViews" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "Campaign"
ADD COLUMN     "platforms" TEXT[] DEFAULT ARRAY[]::TEXT[];

ALTER TABLE "Campaign"
ADD COLUMN     "estimatedViews" INTEGER NOT NULL DEFAULT 0;

-- Backfill title with existing name values
UPDATE "Campaign" SET "title" = CASE
  WHEN COALESCE(TRIM("title"), '') = '' THEN COALESCE("name", '')
  ELSE "title"
END;
