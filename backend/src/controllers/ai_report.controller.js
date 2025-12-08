import AIReport from "../models/ai_report.model.js";
import AIAnalysis from "../models/ai_analysis.model.js";
import Application from "../models/application.model.js";
import mongoose from "mongoose";
import { asyncHandler } from "../services/asyncHandler.js";

// maybe we can use this so if some one want to do some operation on it, so this is useless now but keep it for future use, because now i findout other way to send the data efficient and without much load, i connect the ai analysis with application directly
// maybe we had not to do made this but itso okay, we can use this in future if we want to do some operation on ai report directly

export const getAllAIReports = asyncHandler(async (req, res) => {
    const reports = await AIReport.find()
        .populate("application_id")
        .populate("ai_analysis_id")
        .sort({ created_at: -1 });

    return res.status(200).json({
        success: true,
        message: "AI Reports fetched successfully",
        data: reports,
    });
});


export const getAIReportByApplication = asyncHandler(async (req, res) => {
    const { applicationId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid applicationId",
        });
    }

    const report = await AIReport.findOne({ application_id: applicationId })
        .populate("ai_analysis_id")
        .populate("application_id");

    if (!report) {
        return res.status(404).json({
            success: false,
            message: "No AI report found for this application",
        });
    }

    return res.status(200).json({
        success: true,
        message: "AI Report fetched successfully",
        data: report,
    });
});

// Get AI reports by institution
export const getAIReportsByInstitution = asyncHandler(async (req, res) => {
    const { institutionId } = req.params;

    const reports = await AIReport.find({ institution_id: institutionId })
        .populate("application_id")
        .populate("ai_analysis_id")
        .sort({ created_at: -1 });

    return res.status(200).json({
        success: true,
        count: reports.length,
        data: reports,
    });
});

export const getAIReportById = asyncHandler(async (req, res) => {
    const { reportId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(reportId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid reportId",
        });
    }

    const report = await AIReport.findById(reportId)
        .populate("application_id")
        .populate("ai_analysis_id");

    if (!report) {
        return res.status(404).json({
            success: false,
            message: "AI Report not found",
        });
    }

    return res.status(200).json({
        success: true,
        message: "AI Report fetched successfully",
        data: report,
    });
});