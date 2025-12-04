import Institution from '../models/institution.model.js';
import Parameter from '../models/institution_parameter.model.js';
import Document from '../models/document.model.js';
import Application from '../models/application.model.js';
import AIAnalysis from '../models/ai_analysis.model.js';
import AIReport from '../models/ai_report.model.js';
import { asyncHandler } from '../services/asyncHandler.js';

export const checkAndCreateApplication = async (institutionId, userId) => {
    try {
        console.log('Checking application for:', institutionId, userId);

        // 1. Check if institution exists
        const institution = await Institution.findById(institutionId);
        if (!institution) return { ok: false, reason: 'Institution not found' };

        // 2. Check if 22 parameters exist
        const parameterCount = await Parameter.countDocuments({
            institution_id: institutionId,
        });

        console.log('Parameter count:', parameterCount);

        if (parameterCount < 22) {
            return {
                ok: false,
                reason: 'All 22 AICTE parameters not submitted',
            };
        }

        // 3. Check documents
        const docs = await Document.countDocuments({
            institution_id: institutionId,
        });

        console.log('Document count:', docs);

        if (docs < 1) {
            return { ok: false, reason: 'Required documents not uploaded' };
        }

        // 4. Check if application already exists
        const existing = await Application.findOne({
            institution_id: institutionId,
            status: { $in: ['submitted', 'under_review', 'approved'] },
        });

        if (existing) {
            console.log('Application already exists for institution:', institutionId);
            return { ok: false, reason: 'Application already exists' };
        }

        // 5. Create application
        const app = await Application.create({
            institution_id: institutionId,
            status: 'submitted',
            approved_by: institution.type,
            submitted_at: new Date(),
            submitted_by: userId,
        });

        return { ok: true, application: app };
    } catch (err) {
        console.error('Error inside checkAndCreateApplication:', err);
        return { ok: false, reason: 'Internal server error' };
    }
};

export const createApplicationManually = asyncHandler(async (req, res) => {
    const { institution_id } = req.body;
    console.log(institution_id, req.user.id);

    if (!institution_id)
        return res.status(400).json({
            success: false,
            message: 'Institution ID is required',
        });

    const result = await checkAndCreateApplication(institution_id, req.user.id);

    if (!result || !result.ok) {
        return res.status(400).json({
            success: false,
            message: result?.reason || 'Application creation failed',
        });
    }

    await Institution.findByIdAndUpdate(institution_id, {
        $push: { applications: result.application._id },
    });

    return res.status(201).json({
        success: true,
        message: 'Application created successfully',
        application: result.application,
    });
});

export const getApplication = asyncHandler(async (req, res) => {
    const { institution_id } = req.query;

    if (!institution_id) {
        return res.status(400).json({
            success: false,
            message: 'Institution ID is required',
        });
    }

    const app = await Application.findOne({ institution_id })
        .populate('submitted_by', 'name email role')
        .populate(
            'institution_id',
            'name type state district full_address website established_year institution_code NAAC_grade NIRF_rank AISHE_code UDISE_code website'
        )
        .populate(
            'ai_analysis',
            'parameter_compliance_score status analyzed_by input_data ai_output error run_count run_at'
        )
        .populate('ai_report', 'report_title report_url created_at');

    if (!app) {
        return res.status(404).json({
            success: false,
            message: 'No application found for this institution',
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
    if (userRole === 'super_admin') {
        filter = {}; // No filter → return ALL applications
    }

    // -------------------------
    //  UGC → sees only UGC institutions
    // -------------------------
    if (userRole === 'ugc') {
        filter = { approved_by: 'ugc' };
        // OR if you mark institution under UGC:
        // filter = { "institution_type": "ugc" }
    }

    // -------------------------
    //  AICTE → sees only AICTE institutions
    // -------------------------
    if (userRole === 'aicte') {
        filter = { approved_by: 'aicte' };
        // OR if institutions mapped:
        // filter = { "institution_type": "aicte" }
    }

    // -------------------------
    // Fetch Applications
    // -------------------------
    const apps = await Application.find(filter)
        .populate(
            'institution_id',
            'name type state district full_address website established_year institution_code NAAC_grade NIRF_rank AISHE_code UDISE_code website'
        )
        .populate('submitted_by', 'name email role')
        .populate(
            'ai_analysis',
            'parameter_compliance_score status analyzed_by input_data ai_output error run_count run_at'
        )
        .populate('ai_report', '')
        .sort({ submitted_at: -1 }); // newest first

    return res.json({
        success: true,
        count: apps.length,
        applications: apps,
    });
});
<<<<<<< HEAD

// for approving or rejecting application by ugc , aicte and super_admin
export const ApprovedOrRejectApplication = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { action, remarks } = req.body; // 'approve' or 'reject'
    const userId = req.user.id;

    console.log("USER:", req.user);
    console.log("BODY:", req.body);
    console.log("PARAM:", req.params);

    if (!['approve', 'reject'].includes(action)) {
        return res.status(400).json({
            success: false,
            message: "Action must be either 'approve' or 'reject'",
        });
    }

    const application = await Application.findById(id);

    if (!application) {
        return res.status(404).json({
            success: false,
            message: 'Application not found',
        });
    }

    application.status = action === 'approve' ? 'approved' : 'rejected';
    application.approved_by = req.user.role.toLowerCase();
    application.isApproved = action === 'approve';
    application.remarks = remarks;
    application.approved_by_user = userId;
    await application.save();

    return res.json({
        success: true,
        message: `Application ${action}d successfully`,
        application,
    });
});
=======
>>>>>>> 70f44ec888b96bac5a76ba94e51bd4ea80c51050
