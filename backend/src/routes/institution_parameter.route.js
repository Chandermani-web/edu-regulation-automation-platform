import express from 'express';
import { auth } from '../middlewares/auth.middlware.js'
import { 
    createParameters, 
    updateMultipleParameters,
    getActiveParameterTemplates,
    getInstitutionParameters,
    saveInstitutionParameterValues
} from '../controllers/institution_parameter.controller.js'

const router = express.Router();

// Get all active parameter templates (for institutions to see what's available)
router.get("/templates", getActiveParameterTemplates);

// Get institution's parameter values merged with templates
router.get("/:institution_id", getInstitutionParameters);

// Save/update institution parameter values (new template-based approach)
router.post("/save", saveInstitutionParameterValues);

// Legacy endpoints (kept for backward compatibility)
router.post("/create", createParameters);
router.put("/updates", updateMultipleParameters);
    
export default router;