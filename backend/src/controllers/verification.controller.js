import pythonVerificationService from '../services/pythonVerification.js';
import {  asyncHandler } from '../services/asyncHandler.js';

/**
 * Controller to handle PDF verification requests
 */
class VerificationController {
    /**
     * Check Python server health
     * GET /api/verification/health
     */
    checkHealth = asyncHandler(async (req, res) => {
        const isHealthy = await pythonVerificationService.checkHealth();
        
        res.status(isHealthy ? 200 : 503).json({
            success: isHealthy,
            message: isHealthy 
                ? 'Python verification server is healthy' 
                : 'Python verification server is unavailable',
            serverUrl: pythonVerificationService.getServerUrl()
        });
    });

    /**
     * Verify PDF from URL
     * POST /api/verification/verify-url
     * Body: { "pdfUrl": "https://example.com/document.pdf" }
     */
    verifyPdfFromUrl = asyncHandler(async (req, res) => {
        const { pdfUrl } = req.body;

        if (!pdfUrl) {
            return res.status(400).json({
                success: false,
                message: 'PDF URL is required',
                error: 'Missing pdfUrl in request body'
            });
        }

        // Validate URL format
        try {
            new URL(pdfUrl);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Invalid PDF URL format',
                error: error.message
            });
        }

        // Send to Python server for verification
        const result = await pythonVerificationService.verifyPdfFromUrl(pdfUrl);

        res.status(200).json({
            success: true,
            message: 'PDF verification completed successfully',
            data: result.data,
            serverUsed: result.serverUsed
        });
    });

    /**
     * Verify PDF from uploaded file
     * POST /api/verification/verify-file
     * Form data with 'file' field containing PDF
     */
    verifyPdfFromFile = asyncHandler(async (req, res) => {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'PDF file is required',
                error: 'No file uploaded'
            });
        }

        const file = req.file;

        // Validate file type
        if (!file.mimetype === 'application/pdf' && !file.originalname.endsWith('.pdf')) {
            return res.status(400).json({
                success: false,
                message: 'Only PDF files are allowed',
                error: 'Invalid file type'
            });
        }

        // Send to Python server for verification
        const result = await pythonVerificationService.verifyPdfFromFile(
            file.buffer,
            file.originalname
        );

        res.status(200).json({
            success: true,
            message: 'PDF verification completed successfully',
            data: result.data,
            serverUsed: result.serverUsed
        });
    });

    /**
     * Verify PDF from Cloudinary URL (for documents already uploaded)
     * POST /api/verification/verify-document
     * Body: { "documentId": "123" } or { "cloudinaryUrl": "https://..." }
     */
    verifyDocument = asyncHandler(async (req, res) => {
        const { documentId, cloudinaryUrl } = req.body;

        if (!documentId && !cloudinaryUrl) {
            return res.status(400).json({
                success: false,
                message: 'Document ID or Cloudinary URL is required',
                error: 'Missing documentId or cloudinaryUrl in request body'
            });
        }

        let pdfUrl = cloudinaryUrl;

        // If documentId is provided, fetch the document URL from database
        if (documentId && !cloudinaryUrl) {
            const { default: Document } = await import('../models/document.model.js');
            const document = await Document.findById(documentId);

            if (!document) {
                return res.status(404).json({
                    success: false,
                    message: 'Document not found',
                    error: 'No document found with the provided ID'
                });
            }

            pdfUrl = document.url || document.fileUrl;
        }

        if (!pdfUrl) {
            return res.status(400).json({
                success: false,
                message: 'Document URL not available',
                error: 'Could not retrieve document URL'
            });
        }

        // Send to Python server for verification
        const result = await pythonVerificationService.verifyPdfFromUrl(pdfUrl);

        res.status(200).json({
            success: true,
            message: 'Document verification completed successfully',
            documentId: documentId || null,
            data: result.data,
            serverUsed: result.serverUsed
        });
    });
}

export default new VerificationController();
