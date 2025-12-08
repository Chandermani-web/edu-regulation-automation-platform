import express from 'express';
import {
  getAllInstitutions,
  getInstitutionDetails,
  getApplicationStatus,
  queryByParameters,
  getStatistics,
  bulkQuery,
  getParameterTemplates
} from '../controllers/central_repository.controller.js';
import {
  authenticateCentralRepo,
  requirePermission,
  filterByInstitution,
  restrictToOwnInstitution,
  logApiAccess
} from '../middlewares/centralRepoAuth.middleware.js';

const router = express.Router();

/**
 * Central Repository API Routes
 * Protected endpoints with role-based access control
 * 
 * Authentication Methods:
 * 1. JWT Token (for logged-in users) - via cookies or Authorization header
 * 2. API Key (for external services) - via X-API-Key header or apiKey query param
 * 3. Public access (limited permissions) - no authentication
 */

// Apply authentication and logging to all routes
router.use(authenticateCentralRepo);
router.use(logApiAccess);

// Get all institutions with filtering and pagination
// Permissions: canReadAllInstitutions or canReadInstitutions
router.get(
  '/institutions', 
  filterByInstitution,
  requirePermission('canReadInstitutions'), 
  getAllInstitutions
);

// Get detailed institution data by ID or name
// Permissions: canReadInstitutions + specific data permissions
router.get(
  '/institutions/:identifier', 
  restrictToOwnInstitution,
  requirePermission('canReadInstitutions'), 
  getInstitutionDetails
);

// Get application status by institution or application ID
// Permissions: canReadApplications
router.get(
  '/applications/status/:institutionId?', 
  restrictToOwnInstitution,
  requirePermission('canReadApplications'), 
  getApplicationStatus
);

router.get(
  '/applications/:applicationId/status', 
  requirePermission('canReadApplications'), 
  getApplicationStatus
);

// Query institutions by parameters (POST for complex queries)
// Permissions: canQueryByParameters
router.post(
  '/institutions/query', 
  requirePermission('canQueryByParameters'), 
  queryByParameters
);

// Get aggregated statistics
// Permissions: canReadStatistics
router.get(
  '/statistics', 
  requirePermission('canReadStatistics'), 
  getStatistics
);

// Bulk query for multiple institutions
// Permissions: canBulkQuery
router.post(
  '/institutions/bulk', 
  requirePermission('canBulkQuery'), 
  bulkQuery
);

// Get available parameter templates (public access allowed)
router.get('/parameter-templates', getParameterTemplates);

export default router;
