import { Router } from 'express';
import {
  getAllCrops,
  getCropByName,
  getAllPests,
  getPestByName,
} from '../controllers/knowledgeController';
import { authMiddleware } from '../middlewares/authMiddleware';

const knowledgeRouter = Router();

// Apply auth middleware to protect these routes
knowledgeRouter.use(authMiddleware);

// Crops
knowledgeRouter.get('/crops', getAllCrops);
knowledgeRouter.get('/crops/:name', getCropByName);

// Pests
knowledgeRouter.get('/pests', getAllPests);
knowledgeRouter.get('/pests/:name', getPestByName);

export default knowledgeRouter;
