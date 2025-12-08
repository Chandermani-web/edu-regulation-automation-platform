import AIAnalysis from '../models/ai_analysis.model.js';
import Application from '../models/application.model.js';
import AIReport from '../models/ai_report.model.js';
import Institution from '../models/institution.model.js';
import Document from '../models/document.model.js';
import mongoose from 'mongoose';
import axios from 'axios';
import { asyncHandler } from '../services/asyncHandler.js';
import { generateAIAnalysisReport } from '../services/pdfReportGenerator.js';
import pythonVerificationService from '../services/pythonVerification.js';
// import dotenv from 'dotenv';

// dotenv.config();

// async function callPythonGateway(payload) {
//     try {
//         const gatewayurl = process.env.PYTHON_LOCAL_URL || 'http://localhost:3005';
//         const response = await axios.post(gatewayurl, {
//             message: payload,
//         });
//         const result = response.data;
//         return result;
//     } catch (err) {
//         throw new Error(
//             `Python Gateway Error: ${err?.message || err.message || String(err.message)}`
//         );
//     }
// }

export const processAIAnalysis = asyncHandler(async (req, res) => {
    const { applicationId } = req.body;
    console.log(applicationId);
    console.log('Processing AI Analysis for Application:', applicationId);

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

    // Get institution data
    const institution = await Institution.findById(application.institution_id)
    .populate('documents');

    console.log(institution);

    if (!institution) {
        return res
            .status(404)
            .json({ success: false, message: 'Institution not found' });
    }

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
        institution_id: application.institution_id, // ✅ ADD THIS
        analyzed_by: 'system',
        input_data: payload,
        status: 'running',
        run_count: 1,
        run_at: new Date(),
        verification_results: [],
    });

    await analysis.save();

    try {
        // Step 1: Verify all PDF documents
        console.log('Step 1: Verifying PDF documents...');
        const verificationResults = [];

        if (institution.documents && institution.documents.length > 0) {
            const pdfDocuments = institution.documents.filter(
                (doc) =>
                    doc.file_url && doc.file_url.toLowerCase().includes('.pdf')
            );

            console.log("PDF DOC", pdfDocuments);

            for (const doc of pdfDocuments) {
                try {
                    console.log(`Verifying document: ${doc.file_url}`);
                    const verificationResult =
                        await pythonVerificationService.verifyPdfFromUrl(
                            doc.file_url
                        );

                    console.log(verificationResult);

                    verificationResults.push({
                        document_id: doc._id,
                        document_url: doc.file_url,
                        verification_data: verificationResult,
                        verified_at: new Date(),
                    });

                    console.log(`✓ Document verified successfully`);
                } catch (verifyError) {
                    console.error(
                        `✗ Document verification failed:`,
                        verifyError.message
                    );
                    // Continue with other documents even if one fails
                    verificationResults.push({
                        document_id: doc._id,
                        document_url: doc.file_url,
                        verification_data: { error: verifyError.message },
                        verified_at: new Date(),
                    });
                }
            }
        }

        analysis.verification_results = verificationResults;

        // Step 2: Call Python Gateway for overall analysis
        console.log('Step 2: Processing overall AI analysis...');
        // const pythonResult = await callPythonGateway(payload);

        analysis.ai_output = verificationResults[0] || {};

        console.log('AI Output:', JSON.stringify(verificationResults[0].verification_data.data, null, 2));
        console.log(analysis.ai_output)

        analysis.institution_details =
            verificationResults[0].verification_data.data.institution_details || {};
        analysis.visual_detection =
            verificationResults[0].verification_data.data.visual_detection || {};
        analysis.scores = verificationResults[0].verification_data.data.scores || {};
        analysis.final_decision = verificationResults[0].verification_data.data.final_decision || {};
        const totalScore = verificationResults[0].verification_data.data.scores?.total_score || 0;
        const finalStatus =
            verificationResults[0].verification_data.data.final_decision?.status || 'Pending';
        analysis.parameter_compliance_score = totalScore;
        analysis.ai_total_score = totalScore;
        analysis.final_status = finalStatus;

        analysis.status = 'completed';
        analysis.error = null;

        await analysis.save();

        // Step 3: Generate PDF Report
        console.log('Step 3: Generating PDF report...');
        let report = null;

        try {
            const reportResult = await generateAIAnalysisReport(
                analysis.toObject(),
                application.toObject(),
                institution.toObject()
            );

            report = await AIReport.create({
                application_id: application._id,
                ai_analysis_id: analysis._id,
                report_title: `AI Verification Report - ${institution.name}`,
                report_url: reportResult.url,
                cloudinary_public_id: reportResult.public_id,
                file_size: reportResult.file_size,
                metadata: {
                    institution_name: institution.name,
                    total_score: totalScore,
                    verification_status: finalStatus,
                    document_count: verificationResults.length,
                    generated_at: new Date(),
                },
            });

            // Link report to analysis
            analysis.report_id = report._id;
            await analysis.save();
            console.log(reportResult.url);
            console.log('✓ PDF report generated and uploaded to Cloudinary');
        } catch (reportError) {
            console.error(
                '✗ Failed to generate PDF report:',
                reportError.message
            );
            // Continue even if report generation fails
        }

        // Step 4: Update Application and Institution
        const updatedApplication = await Application.findByIdAndUpdate(
            application._id,
            {
                $push: { ai_analysis: analysis._id },
                ai_report: report ? report._id : null,
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
            data: {
                analysis: analysis,
                report: report,
                verification_count: verificationResults.length,
            },
            ai_output: verificationResults,
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

export const getAIAnalysisByApplication = asyncHandler(async (req, res) => {
    const { applicationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        return res
            .status(400)
            .json({ success: false, message: 'Invalid applicationId' });
    }

    const analyses = await AIAnalysis.find({ application_id: applicationId })
        .populate('report_id')
        .sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        message: 'AI analyses retrieved successfully',
        data: analyses,
    });
});

export const getAIAnalysisById = asyncHandler(async (req, res) => {
    const { analysisId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(analysisId)) {
        return res
            .status(400)
            .json({ success: false, message: 'Invalid analysisId' });
    }

    const analysis = await AIAnalysis.findById(analysisId)
        .populate('report_id')
        .populate('application_id');

    if (!analysis) {
        return res
            .status(404)
            .json({ success: false, message: 'AI analysis not found' });
    }

    return res.status(200).json({
        success: true,
        message: 'AI analysis retrieved successfully',
        data: analysis,
    });
});

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
    console.log(analysisId);

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

        // const report = await AIReport.create({
        //     application_id: application._id,
        //     ai_analysis_id: analysis._id,
        //     report_title: `AI Report for Application ${application._id}`,
        //     report_url: pythonResult?.report_url || '',
        // });

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

// Get AI analysis by institution
export const getAIAnalysisByInstitution = asyncHandler(async (req, res) => {
    const { institutionId } = req.params;

    const analysis = await AIAnalysis.find({ institution_id: institutionId })
        .populate('application_id')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: analysis.length,
        data: analysis
    });
});

// Get historical performance comparison for institutions
export const getInstitutionHistoricalComparison = asyncHandler(async (req, res) => {
    const { institutionIds } = req.body; // Array of 2 institution IDs

    if (!institutionIds || institutionIds.length !== 2) {
        return res.status(400).json({
            success: false,
            message: 'Please provide exactly 2 institution IDs for comparison'
        });
    }

    const [inst1Id, inst2Id] = institutionIds;

    // Fetch all historical data for both institutions
    const [inst1Analysis, inst2Analysis, inst1Reports, inst2Reports] = await Promise.all([
        AIAnalysis.find({ institution_id: inst1Id }).populate('application_id').sort({ createdAt: 1 }),
        AIAnalysis.find({ institution_id: inst2Id }).populate('application_id').sort({ createdAt: 1 }),
        AIReport.find({ institution_id: inst1Id }).populate('application_id').sort({ created_at: 1 }),
        AIReport.find({ institution_id: inst2Id }).populate('application_id').sort({ created_at: 1 })
    ]);

    // Process historical trends
    const inst1Trends = processHistoricalTrends(inst1Analysis, inst1Reports);
    const inst2Trends = processHistoricalTrends(inst2Analysis, inst2Reports);

    // Calculate performance metrics
    const inst1Metrics = calculatePerformanceMetrics(inst1Analysis, inst1Reports);
    const inst2Metrics = calculatePerformanceMetrics(inst2Analysis, inst2Reports);

    res.status(200).json({
        success: true,
        data: {
            institution1: {
                id: inst1Id,
                trends: inst1Trends,
                metrics: inst1Metrics,
                totalAnalyses: inst1Analysis.length,
                totalReports: inst1Reports.length
            },
            institution2: {
                id: inst2Id,
                trends: inst2Trends,
                metrics: inst2Metrics,
                totalAnalyses: inst2Analysis.length,
                totalReports: inst2Reports.length
            }
        }
    });
});

// Helper function to process historical trends
function processHistoricalTrends(analyses, reports) {
    const trends = {
        scoreProgression: [],
        complianceProgression: [],
        categoryScores: {
            infrastructure: [],
            faculty: [],
            academic: [],
            compliance: []
        },
        timestamps: []
    };

    analyses.forEach((analysis, index) => {
        const date = new Date(analysis.createdAt).toLocaleDateString();
        trends.timestamps.push(date);
        trends.scoreProgression.push(analysis.ai_total_score || 0);
        trends.complianceProgression.push(analysis.parameter_compliance_score || 0);
        
        // Extract category scores
        trends.categoryScores.infrastructure.push(analysis.scores?.infrastructure_score || 0);
        trends.categoryScores.faculty.push(analysis.scores?.faculty_score || 0);
        trends.categoryScores.academic.push(analysis.scores?.academic_score || 0);
        trends.categoryScores.compliance.push(analysis.scores?.compliance_score || 0);
    });

    return trends;
}

// Helper function to calculate performance metrics
function calculatePerformanceMetrics(analyses, reports) {
    if (analyses.length === 0) {
        return {
            averageScore: 0,
            highestScore: 0,
            lowestScore: 0,
            averageCompliance: 0,
            improvementRate: 0,
            consistencyScore: 0,
            approvalRate: 0
        };
    }

    const scores = analyses.map(a => a.ai_total_score || 0);
    const complianceScores = analyses.map(a => a.parameter_compliance_score || 0);
    
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);
    const averageCompliance = complianceScores.reduce((a, b) => a + b, 0) / complianceScores.length;
    
    // Calculate improvement rate (comparing first and last score)
    const improvementRate = scores.length > 1 
        ? ((scores[scores.length - 1] - scores[0]) / scores[0]) * 100 
        : 0;
    
    // Calculate consistency (standard deviation)
    const variance = scores.reduce((acc, score) => acc + Math.pow(score - averageScore, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);
    const consistencyScore = Math.max(0, 100 - (stdDev * 2)); // Lower std dev = higher consistency
    
    // Calculate approval rate
    const approvedReports = reports.filter(r => r.final_decision === 'approved').length;
    const approvalRate = reports.length > 0 ? (approvedReports / reports.length) * 100 : 0;

    return {
        averageScore: parseFloat(averageScore.toFixed(2)),
        highestScore,
        lowestScore,
        averageCompliance: parseFloat(averageCompliance.toFixed(2)),
        improvementRate: parseFloat(improvementRate.toFixed(2)),
        consistencyScore: parseFloat(consistencyScore.toFixed(2)),
        approvalRate: parseFloat(approvalRate.toFixed(2)),
        totalSubmissions: analyses.length
    };
}
