import express from "express";
import { createApplicationManually, getAllApplications, getApplication, ApprovedOrRejectApplication } from "../controllers/application.controller.js";
import { auth } from "../middlewares/auth.middlware.js";

const router = express.Router();

// for institution to create and get their application
router.post("/create", auth, createApplicationManually);
router.get("/", auth, getApplication);

// for admin, UGC/ACITE to get all applications
router.get("/all", auth, getAllApplications)

// for approval or rejection of application by UGC/AICTE
router.post("/:id", auth, ApprovedOrRejectApplication);

export default router;