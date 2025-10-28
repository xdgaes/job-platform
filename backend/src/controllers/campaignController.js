import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all campaigns for a user
export const getCampaigns = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const campaigns = await prisma.campaign.findMany({
      where: { creatorId: parseInt(userId) },
      include: {
        analytics: true,
        clips: {
          select: {
            id: true,
            views: true,
            likes: true,
            shares: true,
            rewardEarned: true,
            platform: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
};

// Get single campaign with analytics
export const getCampaignById = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { startDate, endDate } = req.query;

    const campaign = await prisma.campaign.findUnique({
      where: { id: parseInt(campaignId) },
      include: {
        analytics: true,
        clips: {
          where: startDate && endDate ? {
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          } : {},
          orderBy: { views: 'desc' },
        },
      },
    });

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    // Calculate featured clippers (top performers)
    const clipperStats = {};
    campaign.clips.forEach(clip => {
      if (!clipperStats[clip.clipperId]) {
        clipperStats[clip.clipperId] = {
          clipperId: clip.clipperId,
          totalViews: 0,
          totalLikes: 0,
          totalReward: 0,
          clipCount: 0,
        };
      }
      clipperStats[clip.clipperId].totalViews += clip.views;
      clipperStats[clip.clipperId].totalLikes += clip.likes;
      clipperStats[clip.clipperId].totalReward += clip.rewardEarned;
      clipperStats[clip.clipperId].clipCount += 1;
    });

    const featuredClippers = Object.values(clipperStats)
      .sort((a, b) => b.totalViews - a.totalViews)
      .slice(0, 10);

    res.json({
      ...campaign,
      featuredClippers,
    });
  } catch (error) {
    console.error("Error fetching campaign:", error);
    res.status(500).json({ error: "Failed to fetch campaign" });
  }
};

// Create a new campaign
export const createCampaign = async (req, res) => {
  try {
    const { creatorId, name, description, budget } = req.body;

    const campaign = await prisma.campaign.create({
      data: {
        creatorId: parseInt(creatorId),
        name,
        description,
        budget: parseFloat(budget),
      },
      include: {
        analytics: true,
      },
    });

    // Create analytics record
    await prisma.campaignAnalytics.create({
      data: {
        campaignId: campaign.id,
      },
    });

    res.status(201).json(campaign);
  } catch (error) {
    console.error("Error creating campaign:", error);
    res.status(500).json({ error: "Failed to create campaign" });
  }
};

// Update campaign analytics (called when clips are added/updated)
export const updateCampaignAnalytics = async (req, res) => {
  try {
    const { campaignId } = req.params;

    const campaign = await prisma.campaign.findUnique({
      where: { id: parseInt(campaignId) },
      include: { clips: true },
    });

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    // Calculate totals
    const totalViews = campaign.clips.reduce((sum, clip) => sum + clip.views, 0);
    const totalLikes = campaign.clips.reduce((sum, clip) => sum + clip.likes, 0);
    const totalShares = campaign.clips.reduce((sum, clip) => sum + clip.shares, 0);
    const totalSpent = campaign.clips.reduce((sum, clip) => sum + clip.rewardEarned, 0);
    
    const youtubeViews = campaign.clips.filter(c => c.platform === 'youtube').reduce((sum, clip) => sum + clip.views, 0);
    const instagramViews = campaign.clips.filter(c => c.platform === 'instagram').reduce((sum, clip) => sum + clip.views, 0);
    const tiktokViews = campaign.clips.filter(c => c.platform === 'tiktok').reduce((sum, clip) => sum + clip.views, 0);
    
    const uniqueClippers = new Set(campaign.clips.map(c => c.clipperId)).size;
    const cpm = totalViews > 0 ? (totalSpent / totalViews) * 1000 : 0;

    // Update analytics
    await prisma.campaignAnalytics.upsert({
      where: { campaignId: parseInt(campaignId) },
      update: {
        totalViews,
        totalLikes,
        totalShares,
        totalClippers: uniqueClippers,
        youtubeViews,
        instagramViews,
        tiktokViews,
        cpm,
      },
      create: {
        campaignId: parseInt(campaignId),
        totalViews,
        totalLikes,
        totalShares,
        totalClippers: uniqueClippers,
        youtubeViews,
        instagramViews,
        tiktokViews,
        cpm,
      },
    });

    // Update campaign total spent
    await prisma.campaign.update({
      where: { id: parseInt(campaignId) },
      data: { totalSpent },
    });

    res.json({ message: "Analytics updated successfully" });
  } catch (error) {
    console.error("Error updating analytics:", error);
    res.status(500).json({ error: "Failed to update analytics" });
  }
};

// Add a clip to a campaign
export const addClip = async (req, res) => {
  try {
    const { campaignId, clipperId, title, platform, videoUrl, views, likes, shares, rewardEarned } = req.body;

    const clip = await prisma.clip.create({
      data: {
        campaignId: parseInt(campaignId),
        clipperId: parseInt(clipperId),
        title,
        platform,
        videoUrl,
        views: parseInt(views) || 0,
        likes: parseInt(likes) || 0,
        shares: parseInt(shares) || 0,
        rewardEarned: parseFloat(rewardEarned) || 0,
      },
    });

    res.status(201).json(clip);
  } catch (error) {
    console.error("Error adding clip:", error);
    res.status(500).json({ error: "Failed to add clip" });
  }
};
