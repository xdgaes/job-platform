/*
  Warnings:

  - Made the column `createdAt` on table `CampaignFeedback` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `CampaignFeedback` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."CampaignFeedback" DROP CONSTRAINT "CampaignFeedback_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CampaignFeedback" DROP CONSTRAINT "CampaignFeedback_userId_fkey";

-- AlterTable
ALTER TABLE "CampaignFeedback" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "CampaignFeedback" ADD CONSTRAINT "CampaignFeedback_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignFeedback" ADD CONSTRAINT "CampaignFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
