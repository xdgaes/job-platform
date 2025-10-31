-- CreateTable
CREATE TABLE "CampaignFeedback" (
    "id" SERIAL PRIMARY KEY,
    "campaignId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for query performance
CREATE INDEX "CampaignFeedback_campaignId_idx" ON "CampaignFeedback" ("campaignId");
CREATE INDEX "CampaignFeedback_userId_idx" ON "CampaignFeedback" ("userId");

-- Foreign Keys
ALTER TABLE "CampaignFeedback"
  ADD CONSTRAINT "CampaignFeedback_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE;

ALTER TABLE "CampaignFeedback"
  ADD CONSTRAINT "CampaignFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
