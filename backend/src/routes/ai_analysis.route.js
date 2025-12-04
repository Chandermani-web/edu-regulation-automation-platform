import express from 'express';
import { processAIAnalysis, retryAIAnalysis } from '../controllers/ai_analysis.controller.js';

const router = express.Router();

router.post('/process', processAIAnalysis );
router.post('/retry', retryAIAnalysis );

export default router;