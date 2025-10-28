import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all connected accounts for a user
export const getConnectedAccounts = async (req, res) => {
  try {
    const { userId } = req.params;

    const accounts = await prisma.connectedAccount.findMany({
      where: { 
        userId: parseInt(userId),
        isActive: true,
      },
      select: {
        id: true,
        platform: true,
        username: true,
        accountId: true,
        connectedAt: true,
        isActive: true,
      },
    });

    res.json(accounts);
  } catch (error) {
    console.error("Error fetching connected accounts:", error);
    res.status(500).json({ error: "Failed to fetch connected accounts" });
  }
};

// Connect a new account
export const connectAccount = async (req, res) => {
  try {
    const { userId, platform, username, accountId, accessToken, refreshToken } = req.body;

    // Check if account already exists
    const existing = await prisma.connectedAccount.findUnique({
      where: {
        userId_platform: {
          userId: parseInt(userId),
          platform,
        },
      },
    });

    if (existing) {
      // Update existing account
      const updated = await prisma.connectedAccount.update({
        where: { id: existing.id },
        data: {
          username,
          accountId,
          accessToken,
          refreshToken,
          isActive: true,
        },
      });
      return res.json(updated);
    }

    // Create new account
    const account = await prisma.connectedAccount.create({
      data: {
        userId: parseInt(userId),
        platform,
        username,
        accountId,
        accessToken,
        refreshToken,
      },
    });

    res.status(201).json(account);
  } catch (error) {
    console.error("Error connecting account:", error);
    res.status(500).json({ error: "Failed to connect account" });
  }
};

// Disconnect an account
export const disconnectAccount = async (req, res) => {
  try {
    const { accountId } = req.params;

    await prisma.connectedAccount.update({
      where: { id: parseInt(accountId) },
      data: { isActive: false },
    });

    res.json({ message: "Account disconnected successfully" });
  } catch (error) {
    console.error("Error disconnecting account:", error);
    res.status(500).json({ error: "Failed to disconnect account" });
  }
};

// Get available platforms (platforms not yet connected)
export const getAvailablePlatforms = async (req, res) => {
  try {
    const { userId } = req.params;
    const allPlatforms = ['youtube', 'instagram', 'tiktok'];

    const connected = await prisma.connectedAccount.findMany({
      where: { 
        userId: parseInt(userId),
        isActive: true,
      },
      select: { platform: true },
    });

    const connectedPlatforms = connected.map(acc => acc.platform);
    const available = allPlatforms.filter(p => !connectedPlatforms.includes(p));

    res.json({ available, connected: connectedPlatforms });
  } catch (error) {
    console.error("Error fetching available platforms:", error);
    res.status(500).json({ error: "Failed to fetch available platforms" });
  }
};
