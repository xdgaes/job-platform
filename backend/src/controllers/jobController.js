// backend/src/controllers/jobController.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// very simple in-memory cache for list endpoint
const jobsCache = {
  // key: `${page}:${limit}` -> { data, ts }
  data: new Map(),
  ttlMs: 30_000, // 30s
  get(key) {
    const entry = this.data.get(key);
    if (!entry) return null;
    if (Date.now() - entry.ts > this.ttlMs) {
      this.data.delete(key);
      return null;
    }
    return entry.value;
  },
  set(key, value) {
    this.data.set(key, { value, ts: Date.now() });
  },
};

export const getJobs = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "12", 10), 1), 100);
    const skip = (page - 1) * limit;

    const cacheKey = `${page}:${limit}`;
    const cached = jobsCache.get(cacheKey);
    if (cached) return res.json(cached);

    const [items, total] = await Promise.all([
      prisma.job.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          description: true,
          reward: true,
          createdAt: true,
        },
      }),
      prisma.job.count(),
    ]);

    const payload = {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
    jobsCache.set(cacheKey, payload);

    // caching headers for clients/proxies (short)
    res.set("Cache-Control", "public, max-age=30");
    res.json(payload);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createJob = async (req, res) => {
  try {
    const { title, description, salary } = req.body;
    const newJob = await prisma.job.create({
      data: { title, description, salary },
    });
    res.status(201).json(newJob);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
