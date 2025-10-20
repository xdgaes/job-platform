// backend/src/controllers/jobController.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany();
    res.json(jobs);
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
