import express from 'express';
import { createInstitute, updateInstitute, getInstituteByUser, getAllInstitute } from '../controllers/institution.controller.js';
import { auth } from '../middlewares/auth.middlware.js';

const router = express.Router();

// create institute
router.post("/create", auth, createInstitute);

// update institute data
router.put("/update",auth, updateInstitute);

// get institutes

router.get("/my", auth, getInstituteByUser);
router.get("/all", auth, getAllInstitute);

export default router;