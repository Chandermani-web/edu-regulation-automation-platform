import Institution from "../models/institution.model.js";
import Parameter from "../models/institution_parameter.model.js";
import Document from "../models/document.model.js";
import Application from "../models/application.model.js";
import { asyncHandler } from "../services/asyncHandler.js";

export const checkAndCreateApplication = asyncHandler(async (institutionId, userId) => {

  // 1. Check if institution exists
  const institution = await Institution.findById(institutionId);
  if (!institution) return { ok: false, reason: "Institution not found" };

  // 2. Check if 23 parameters exist
  const parameterCount = await Parameter.countDocuments({ institution_id: institutionId });
  if (parameterCount < 23) {
    return { ok: false, reason: "All 23 AICTE parameters not submitted" };
  }

  // 3. Check if required documents uploaded (you decide count)
  const docs = await Document.countDocuments({ institution: institutionId });
  if (docs < 1) { 
    return { ok: false, reason: "Required documents not uploaded" };
  }

  // 4. Check if an application already exists (avoid duplicates)
  const existing = await Application.findOne({
    institution: institutionId,
    status: { $in: ["submitted", "under_review", "approved"] }
  });

  if (existing) {
    return { ok: false, reason: "Application already exists" };
  }

  // 5. All good → create application
  const app = await Application.create({
    institution_id: institutionId,
    status: "submitted",
    approved_by: institution.type,
    submitted_at: new Date(),
    submitted_by: userId
  });

  return { ok: true, application: app };
});

export const createApplicationManually = asyncHandler(async (req, res) => {
  const { institution_id } = req.body;

  if (!institution_id)
    return res.status(400).json({
      success: false,
      message: "Institution ID is required",
    });

  const result = await checkAndCreateApplication(institution_id, req.user._id);

  if (!result.ok) {
    return res.status(400).json({
      success: false,
      message: result.reason,
    });
  }

  return res.status(201).json({
    success: true,
    message: "Application created successfully",
    application: result.application,
  });
});

export const getApplication = asyncHandler(async (req, res) => {
  const { institution_id } = req.body;

  if (!institution_id) {
    return res.status(400).json({
      success: false,
      message: "Institution ID is required",
    });
  }

  const app = await Application.findOne({ institution_id })
    .populate("submitted_by", "name email role")
    .populate("institution_id", "name type state district website established_year total_students total_faculty");

  if (!app) {
    return res.status(404).json({
      success: false,
      message: "No application found for this institution",
    });
  }

  return res.json({
    success: true,
    application: app,
  });
});



// to get all the application for ugc , aicte and super_admin
export const getAllApplications = asyncHandler(async (req, res) => {
  const userRole = req.user.role;

  let filter = {};

  // -------------------------
  //  SUPER ADMIN → sees all
  // -------------------------
  if (userRole === "super_admin") {
    filter = {}; // No filter → return ALL applications
  }

  // -------------------------
  //  UGC → sees only UGC institutions
  // -------------------------
  if (userRole === "ugc") {
    filter = { approved_by: "ugc" }; 
    // OR if you mark institution under UGC:
    // filter = { "institution_type": "ugc" }
  }

  // -------------------------
  //  AICTE → sees only AICTE institutions
  // -------------------------
  if (userRole === "aicte") {
    filter = { approved_by: "aicte" };
    // OR if institutions mapped:
    // filter = { "institution_type": "aicte" }
  }

  // -------------------------
  // Fetch Applications
  // -------------------------
  const apps = await Application.find(filter)
    .populate("institution_id", "name type state district website established_year total_students total_faculty")
    .populate("submitted_by", "name email role")
    .sort({ submitted_at: -1 }); // newest first

  return res.json({
    success: true,
    count: apps.length,
    applications: apps,
  });
});