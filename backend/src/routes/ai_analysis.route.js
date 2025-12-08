import express from 'express';
import { processAIAnalysis, retryAIAnalysis, getAIAnalysisByInstitution, getInstitutionHistoricalComparison } from '../controllers/ai_analysis.controller.js';

const router = express.Router();

router.post('/process/', processAIAnalysis );
router.post('/retry/:id', retryAIAnalysis );
router.get('/institution/:institutionId', getAIAnalysisByInstitution);
router.post('/historical-comparison', getInstitutionHistoricalComparison);

export default router;