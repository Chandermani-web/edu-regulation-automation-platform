import express from "express";
import { createApplicationManually, getAllApplications, getApplication } from "../controllers/application.controller.js";
import { auth } from "../middlewares/auth.middlware.js";

const router = express.Router();

router.post("/create", auth, createApplicationManually);
router.get("/",auth, getApplication);
router.get("/all",auth, getAllApplications)
export default router;