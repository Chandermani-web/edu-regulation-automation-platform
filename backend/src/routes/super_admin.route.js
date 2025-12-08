import express from 'express';
import { auth } from '../middlewares/auth.middlware.js';
import { hasrole } from '../middlewares/role.middleware.js';
import {
    // User Management
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    
    // Institution Management
    getAllInstitutions,
    getInstitutionById,
    createInstitution,
    updateInstitution,
    deleteInstitution,
    
    // Parameter Template Management
    getAllParameterTemplates,
    getParameterTemplateById,
    createParameterTemplate,
    updateParameterTemplate,
    deleteParameterTemplate,
    toggleParameterTemplateStatus,
    bulkCreateParameterTemplates,
    
    // Dashboard
    getDashboardStats
} from '../controllers/super_admin.controller.js';
import {
    generateNewApiKey,
    getAllApiKeys,
    revokeApiKeyById,
    getAvailableRoles
} from '../controllers/api_key.controller.js';

const router = express.Router();

// All routes require authentication and super_admin role
router.use(auth, hasrole('super_admin'));

// ==================== DASHBOARD ====================
router.get('/dashboard/stats', getDashboardStats);

// ==================== USER MANAGEMENT ROUTES ====================
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// ==================== INSTITUTION MANAGEMENT ROUTES ====================
router.get('/institutions', getAllInstitutions);
router.get('/institutions/:id', getInstitutionById);
router.post('/institutions', createInstitution);
router.put('/institutions/:id', updateInstitution);
router.delete('/institutions/:id', deleteInstitution);

// ==================== PARAMETER TEMPLATE MANAGEMENT ROUTES ====================
router.get('/parameter-templates', getAllParameterTemplates);
router.get('/parameter-templates/:id', getParameterTemplateById);
router.post('/parameter-templates', createParameterTemplate);
router.post('/parameter-templates/bulk', bulkCreateParameterTemplates);
router.put('/parameter-templates/:id', updateParameterTemplate);
router.patch('/parameter-templates/:id/toggle-status', toggleParameterTemplateStatus);
router.delete('/parameter-templates/:id', deleteParameterTemplate);

// ==================== API KEY MANAGEMENT ROUTES ====================
router.get('/api-keys', getAllApiKeys);
router.get('/api-keys/roles', getAvailableRoles);
router.post('/api-keys/generate', generateNewApiKey);
router.delete('/api-keys/revoke', revokeApiKeyById);

export default router;
