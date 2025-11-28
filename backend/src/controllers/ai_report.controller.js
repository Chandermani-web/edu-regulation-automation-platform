import AIReport from "../models/ai_report.model.js";
import AIAnalysis from "../models/ai_analysis.model.js";
import Application from "../models/application.model.js";
import mongoose from "mongoose";
import { asyncHandler } from "../services/asyncHandler.js";

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