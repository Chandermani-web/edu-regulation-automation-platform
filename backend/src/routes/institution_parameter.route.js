import express from 'express';
import { auth } from '../middlewares/auth.middlware.js'
import { createParameters, updateMultipleParameters } from '../controllers/institution_parameter.controller.js'

const router = express.Router();

router.post("/create", createParameters);

// router.put("/update", auth, updateSingleParameter);
router.put("/updates",  updateMultipleParameters);
    
export default router;