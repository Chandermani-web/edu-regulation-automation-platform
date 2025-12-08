import express from 'express';
import { getAllAIReports,getAIReportByApplication,getAIReportById } from '../controllers/ai_report.controller.js';

const router = express.Router();

router.get('/all', getAllAIReports);
router.post('/by-application', getAIReportByApplication);
router.post('/by-id', getAIReportById);

export default router;