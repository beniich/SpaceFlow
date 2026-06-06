import { Router } from 'express';
import { askAgroBrain } from '../services/aiService';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Protect the AI route with Firebase Auth middleware
router.post('/chat', authMiddleware, async (req, res, next) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: "La question est requise." });
    }

    // Default to 'simulation-user' if req.user is undefined (e.g. dev environment mock)
    const userId = req.user?.uid || 'simulation-user';
    
    const answer = await askAgroBrain(userId, question);
    res.json({ answer });
  } catch (error: any) {
    next(error); // Pass to global error handler
  }
});

export default router;
