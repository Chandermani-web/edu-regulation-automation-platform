import AIAnalysis from '../models/ai_analysis.model.js';
import Application from '../models/application.model.js';
import AIReport from '../models/ai_report.model.js';
import Institution from '../models/institution.model.js';
import mongoose from 'mongoose';
import axios from 'axios';
import { asyncHandler } from '../services/asyncHandler.js';

async function callPythonGateway(payload) {
    try {
        const gatewayurl = 'http://127.0.0.1:5000/process-data';
        const response = await axios.post(gatewayurl, {
            message: payload,
        });
        const result = response.data;
        return result;
    } catch (err) {
        throw new Error(
            `Python Gateway Error: ${err?.message || err.message || String(err.message)}`
        );
    }
}

export const processAIAnalysis = asyncHandler(async (req, res) => {
    const { applicationId } = req.params;
    console.log(applicationId);

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        return res
            .status(400)
            .json({ success: false, message: 'Invalid applicationId' });
    }

    const application = await Application.findById(applicationId);
    if (!application)
        return res
            .status(404)
            .json({ success: false, message: 'Application not found' });

    const payload = {
        applicationId: application._id,
        meta: {
            institution_id: application.institution_id,
            submitted_by: application.submitted_by,
            status: application.status,
            approved_by: application.approved_by,
        },
    };

    const analysis = new AIAnalysis({
        application_id: application._id,
        analyzed_by: 'system',
        input_data: payload,
        status: 'running',
        run_count: 1,
        run_at: new Date(),
    });

    await analysis.save();

    try {
        const pythonResult = await callPythonGateway(payload);

        analysis.ai_output = pythonResult;

        analysis.institution_details = pythonResult?.institution_details || {};
        analysis.visual_detection = pythonResult?.visual_detection || {};
        analysis.scores = pythonResult?.scores || {};
        analysis.final_decision = pythonResult?.final_decision || {};

        const totalScore = pythonResult?.scores?.total_score || 0;
        const finalStatus = pythonResult?.final_decision?.status || 'Pending';

        analysis.parameter_compliance_score = totalScore;
        analysis.ai_total_score = totalScore;
        analysis.final_status = finalStatus;

        analysis.status = 'completed';
        analysis.error = null;

        analysis.error = null;

        await analysis.save();

        const report = await AIReport.create({
            application_id: application._id,
            ai_analysis_id: analysis._id,
            report_title: `AI Report for Application ${application._id}`,
            report_url: pythonResult?.report_url || '',
        });

        const updatedApplication = await Application.findByIdAndUpdate(
            application._id,
            {
                $push: { ai_analysis: analysis._id },
                ai_report: report._id,
            },
            { new: true }
        );

        const updatedInstitution = await Institution.findByIdAndUpdate(
            application.institution_id,
            {
                $push: { ai_analysis: analysis._id },
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: 'AI analysis completed successfully',
            data: analysis,
            ai_output: pythonResult,
        });
    } catch (err) {
        analysis.status = 'failed';
        analysis.error = err?.message || err.message || String(err.message);
        await analysis.save();

        return res.status(500).json({
            success: false,
            message: 'AI analysis failed',
            error: err?.message || err.message || String(err.message),
            analysis_id: analysis._id,
        });
    }
});

// export const getAIAnalysisByApplication = asyncHandler(async (req,res) => {
//     const { applicationId } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(applicationId)) {
//         return res
//             .status(400)
//             .json({ success: false, message: 'Invalid applicationId' });
//     }

//     const analyses = await AIAnalysis.find({ application_id: applicationId }).sort({ createdAt: -1 });
//     return res.status(200).json({
//         success: true,
//         message: 'AI analyses retrieved successfully',
//         data: analyses,
//     });
// })

// export const getAIAnalysisById = asyncHandler(async (req,res) => {
//     const { analysisId } = req.body;
//     if (!mongoose.Types.ObjectId.isValid(analysisId)) {
//         return res
//             .status(400)
//             .json({ success: false, message: 'Invalid analysisId' });
//     }
//     const analysis = await AIAnalysis.findById(analysisId);
//     if (!analysis) {
//         return res
//             .status(404)
//             .json({ success: false, message: 'AI analysis not found' });
//     }
//     return res.status(200).json({
//         success: true,
//         message: 'AI analysis retrieved successfully',
//         data: analysis,
//     });
// });

// export const getAIAnalysisAll = asyncHandler(async (req,res) => {
//     const analyses = await AIAnalysis.find().sort({ createdAt: -1 });
//     return res.status(200).json({
//         success: true,
//         message: 'All AI analyses retrieved successfully',
//         data: analyses,
//     });
// })

export const retryAIAnalysis = asyncHandler(async (req, res) => {
    const { analysisId } = req.params;
    console.log(analysisId)

    if (!mongoose.Types.ObjectId.isValid(analysisId)) {
        return res
            .status(400)
            .json({ success: false, message: 'Invalid analysisId' });
    }

    const analysis = await AIAnalysis.findById(analysisId);
    if (!analysis) {
        return res
            .status(404)
            .json({ success: false, message: 'AI analysis not found' });
    }

    const application = await Application.findById(analysis.application_id);
    if (!application)
        return res
            .status(404)
            .json({ success: false, message: 'Application not found' });

    const payload = analysis.input_data;

    analysis.status = 'running';
    analysis.run_count += 1;
    analysis.run_at = new Date();
    await analysis.save();
    try {
        const pythonResult = await callPythonGateway(payload);
        
        analysis.ai_output = pythonResult;

        analysis.institution_details = pythonResult?.institution_details || {};
        analysis.visual_detection = pythonResult?.visual_detection || {};
        analysis.scores = pythonResult?.scores || {};
        analysis.final_decision = pythonResult?.final_decision || {};

        const totalScore = pythonResult?.scores?.total_score || 0;
        const finalStatus = pythonResult?.final_decision?.status || 'Pending';

        analysis.parameter_compliance_score = totalScore;
        analysis.ai_total_score = totalScore;
        analysis.final_status = finalStatus;

        analysis.status = 'completed';
        analysis.error = null;

        analysis.error = null;

        await analysis.save();

        const report = await AIReport.create({
            application_id: application._id,
            ai_analysis_id: analysis._id,
            report_title: `AI Report for Application ${application._id}`,
            report_url: pythonResult?.report_url || '',
        });

        const updatedApplication = await Application.findByIdAndUpdate(
            application._id,
            {
                $push: { ai_analysis: analysis._id },
                // ai_report: report._id,
            },
            { new: true }
        );

        const updatedInstitution = await Institution.findByIdAndUpdate(
            application.institution_id,
            {
                $push: { ai_analysis: analysis._id },
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: 'AI analysis retried and completed successfully',
            data: analysis,
            application_id: application._id,
            ai_output: pythonResult,
        });
    } catch (err) {
        analysis.status = 'failed';
        analysis.error = err?.message || err.message || String(err.message);
        await analysis.save();
        return res.status(500).json({
            success: false,
            message: 'AI analysis retry failed',
            error: err?.message || err.message || String(err.message),
            analysis_id: analysis._id,
        });
    }
});
