import express from 'express';
import verificationController from '../controllers/verification.controller.js';
// import {upload} from '../middlewares/upload.js';

const router = express.Router();

/**
 * Verification Routes
 * Base path: /api/verification
 */

// Health check endpoint
router.get('/health', verificationController.checkHealth);

// Verify PDF from URL
router.post('/verify-url', verificationController.verifyPdfFromUrl);

// Verify document by ID or Cloudinary URL
router.post('/verify-document', verificationController.verifyDocument);

export default router;
