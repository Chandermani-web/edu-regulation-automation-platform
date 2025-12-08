import express from 'express';
import { getAllAIReports,getAIReportByApplication,getAIReportById,getAIReportsByInstitution } from '../controllers/ai_report.controller.js';

const router = express.Router();

router.get('/all', getAllAIReports);
router.post('/by-application', getAIReportByApplication);
router.post('/by-id', getAIReportById);
router.get('/institution/:institutionId', getAIReportsByInstitution);

export default router;