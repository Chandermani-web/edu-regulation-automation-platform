import { asyncHandler } from '../services/asyncHandler.js';
import Institution from '../models/institution.model.js';
import Parameter from '../models/institution_parameter.model.js';
import Document from '../models/document.model.js';
import AIAnalysis from '../models/ai_analysis.model.js';

export const createInstitute = asyncHandler(async (req, res) => {
    const {
        name,
        type,
        email,
        established_year,
        institution_code,
        state,
        district,
        address,
        pincode,
        phone,
        total_faculty,
        total_students,
        full_address,
        website,
        courses,
        NAAC_grade,
        NIRF_rank,
        AISHE_code,
        UDISE_code,
    } = req.body;

    const existingInstitute = await Institution.findOne({
        name,
        state,
        website,
        district,
        address,
        established_year,
        type,
    });

    if (existingInstitute)
        return res
            .status(404)
            .json({ message: 'Institution is already exist' });

    const institution = await Institution.create({
        user_id: req.user.id,
        name,
        type,
        email,
        established_year,
        institution_code,
        state,
        district,
        address,
        phone,
        total_faculty,
        total_students,
        pincode,
        courses,
        full_address,
        website,
        NAAC_grade,
        NIRF_rank,
        AISHE_code,
        UDISE_code,
    });

    return res.status(201).json({
        success: true,
        institution,
        message: 'Institution Created Successfully',
    });
});

export const getInstituteByUser = asyncHandler(async (req, res) => {
    const data = await Institution.find({ user_id: req.user.id })
        .populate(
            'parameters',
            '_id parameter_category parameter_name norm_value institution_value authority criticality is_compliant'
        )
        .populate(
            'documents',
            'title file_url public_id category, uploaded_by upliaded_at'
        )
        .populate(
            'applications',
            'status submitted_by submitted_at updatedAt approved_by isApproved'
        )
        .populate(
            'ai_analysis',
            'institution_id application_id  analyzed_by input_data ai_output institution_details visual_detection scores final_decision ai_total_score final_status parameter_compliance_score status error run_count run_at'
        );
    return res.status(201).json({ success: true, data });
});

export const updateInstitute = asyncHandler(async (req, res) => {
    const {
        name,
        type,
        email,
        established_year,
        institution_code,
        state,
        district,
        address,
        pincode,
        full_address,
        courses,
        website,
        NAAC_grade,
        NIRF_rank,
        AISHE_code,
        UDISE_code,
    } = req.body;

    const existingInstitution = await Institution.findOne({
        user_id: req.user.id,
    });
    if (!existingInstitution)
        return res.status(404).json({ message: 'Institution not found' });

    // update field if provided
    if (name !== undefined) existingInstitution.name = name;
    if (state !== undefined) existingInstitution.state = state;
    if (district !== undefined) existingInstitution.district = district;
    if (address !== undefined) existingInstitution.address = address;
    if (established_year !== undefined)
        existingInstitution.established_year = established_year;
    if (institution_code !== undefined)
        existingInstitution.institution_code = institution_code;
    if (pincode !== undefined) existingInstitution.pincode = pincode;
    if (full_address !== undefined)
        existingInstitution.full_address = full_address;
    if (type !== undefined) existingInstitution.type = type;
    if (email !== undefined) existingInstitution.email = email;
    if (website !== undefined) existingInstitution.website = website;
    if (NAAC_grade !== undefined) existingInstitution.NAAC_grade = NAAC_grade;
    if (NIRF_rank !== undefined) existingInstitution.NIRF_rank = NIRF_rank;
    if (AISHE_code !== undefined) existingInstitution.AISHE_code = AISHE_code;
    if (UDISE_code !== undefined) existingInstitution.UDISE_code = UDISE_code;
    if (courses !== undefined) existingInstitution.courses = courses;

    await existingInstitution.save();
    return res.status(200).json({
        message: 'Institution Updated Successfully',
    });
});

export const getAllInstitute = asyncHandler(async (req, res) => {
    console.log('=== getAllInstitute called ===');
    
    const institutes = await Institution.find()
        .populate({
            path: 'parameters',
            select: 'institution_value is_compliant remarks parameter_template_id',
            populate: {
                path: 'parameter_template_id',
                model: 'ParameterTemplate',
                select: 'parameter_category parameter_name norm_value authority criticality description'
            }
        })
        .populate(
            'documents',
            'title file_url public_id category uploaded_by uploaded_at'
        )
        .populate(
            'applications',
            'status submitted_by submitted_at updatedAt approved_by isApproved remarks ai_analysis ai_report'
        )
        .populate(
            'ai_analysis',
            'institution_id application_id  analyzed_by input_data ai_output institution_details visual_detection scores final_decision ai_total_score final_status parameter_compliance_score status error run_count run_at'
        );

    // Debug log first parameter of first institution
    if (institutes?.length > 0 && institutes[0].parameters?.length > 0) {
        console.log('Sample parameter:', JSON.stringify(institutes[0].parameters[0], null, 2));
    }

    if (!institutes)
        return res.status(404).json({ message: 'Institutes not found' });

    res.status(200).json({
        success: true,
        count: institutes.length,
        data: institutes
    });
});
