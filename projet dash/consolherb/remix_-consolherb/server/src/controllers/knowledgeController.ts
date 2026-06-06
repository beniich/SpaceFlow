import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const getAllCrops = async (_req: Request, res: Response) => {
  try {
    const crops = await prisma.cropKnowledge.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(crops);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch crops knowledge' });
  }
};

export const getCropByName = async (req: Request, res: Response) => {
  try {
    const name = req.params.name;
    const crop = await prisma.cropKnowledge.findUnique({
      where: { name },
    });
    if (!crop) {
      return res.status(404).json({ error: 'Crop not found' });
    }
    res.json(crop);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch crop knowledge' });
  }
};

export const getAllPests = async (_req: Request, res: Response) => {
  try {
    const pests = await prisma.pestKnowledge.findMany({
      orderBy: { pestName: 'asc' },
    });
    res.json(pests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pests knowledge' });
  }
};

export const getPestByName = async (req: Request, res: Response) => {
  try {
    const pestName = req.params.name;
    const pest = await prisma.pestKnowledge.findUnique({
      where: { pestName },
    });
    if (!pest) {
      return res.status(404).json({ error: 'Pest not found' });
    }
    res.json(pest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pest knowledge' });
  }
};
