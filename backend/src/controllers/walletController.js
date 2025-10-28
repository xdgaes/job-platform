import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get wallet information
export const getWallet = async (req, res) => {
  try {
    const { userId } = req.params;

    let wallet = await prisma.wallet.findUnique({
      where: { userId: parseInt(userId) },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 50, // Last 50 transactions
        },
      },
    });

    // Create wallet if it doesn't exist
    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId: parseInt(userId),
          balance: 0,
        },
        include: {
          transactions: true,
        },
      });
    }

    res.json(wallet);
  } catch (error) {
    console.error("Error fetching wallet:", error);
    res.status(500).json({ error: "Failed to fetch wallet" });
  }
};

// Add funds to wallet
export const addFunds = async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount, description } = req.body;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Get or create wallet
    let wallet = await prisma.wallet.findUnique({
      where: { userId: parseInt(userId) },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId: parseInt(userId),
          balance: 0,
        },
      });
    }

    // Create transaction and update balance
    const [transaction, updatedWallet] = await prisma.$transaction([
      prisma.transaction.create({
        data: {
          walletId: wallet.id,
          amount: parsedAmount,
          type: 'credit',
          description: description || 'Funds added',
        },
      }),
      prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: {
            increment: parsedAmount,
          },
        },
        include: {
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 50,
          },
        },
      }),
    ]);

    res.json(updatedWallet);
  } catch (error) {
    console.error("Error adding funds:", error);
    res.status(500).json({ error: "Failed to add funds" });
  }
};

// Withdraw funds from wallet
export const withdrawFunds = async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount, description } = req.body;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId: parseInt(userId) },
    });

    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    if (wallet.balance < parsedAmount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Create transaction and update balance
    const [transaction, updatedWallet] = await prisma.$transaction([
      prisma.transaction.create({
        data: {
          walletId: wallet.id,
          amount: parsedAmount,
          type: 'debit',
          description: description || 'Funds withdrawn',
        },
      }),
      prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: {
            decrement: parsedAmount,
          },
        },
        include: {
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 50,
          },
        },
      }),
    ]);

    res.json(updatedWallet);
  } catch (error) {
    console.error("Error withdrawing funds:", error);
    res.status(500).json({ error: "Failed to withdraw funds" });
  }
};

// Get transaction history
export const getTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const wallet = await prisma.wallet.findUnique({
      where: { userId: parseInt(userId) },
    });

    if (!wallet) {
      return res.json([]);
    }

    const transactions = await prisma.transaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset),
    });

    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};
