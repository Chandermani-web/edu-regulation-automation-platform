import { asyncHandler } from '../services/asyncHandler.js';
import Institution from '../models/institution.model.js';
import Parameter from '../models/institution_parameter.model.js';
import Document from '../models/document.model.js';

export const createInstitute = asyncHandler(async (req, res) => {
    const {
        name,
        type,
        state,
        district,
        address,
        established_year,
        total_students,
        total_faculty,
        website,
        accreditation_status,
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
        state,
        district,
        address,
        established_year,
        total_students,
        total_faculty,
        website,
        accreditation_status,
    });

    return res.status(201).json({
        success: true,
        institution,
        message: 'Institution Created Successfully',
    });
});

export const getInstituteByUser = asyncHandler(async (req, res) => {
    const data = await Institution.findOne({ user_id: req.user.id }).populate(
        'parameters',
        '_id parameter_category parameter_name norm_value institution_value authority criticality is_compliant'
    )
    .populate(
            'documents',
            'title file_url public_id category, uploaded_by upliaded_at'
    );
    return res.status(201).json({ success: true, data });
});

export const updateInstitute = asyncHandler(async (req, res) => {
    const {
        name,
        state,
        district,
        address,
        established_year,
        total_students,
        total_faculty,
        website,
        accreditation_status,
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
    if (total_students !== undefined)
        existingInstitution.total_students = total_students;
    if (total_faculty !== undefined)
        existingInstitution.total_faculty = total_faculty;
    if (website !== undefined) existingInstitution.website = website;
    if (accreditation_status !== undefined)
        existingInstitution.accreditation_status = accreditation_status;

    await existingInstitution.save();
    return res.status(200).json({
        message: 'Institution Updated Successfully',
    });
});

export const getAllInstitute = asyncHandler(async (req, res) => {
    const institutes = await Institution.find()
        .populate(
            'parameters',
            'parameter_category parameter_name norm_value institution_value authority criticality is_compliant'
        )
        .populate(
            'documents',
            'title file_url public_id category, uploaded_by upliaded_at'
        );

    if (!institutes)
        return res.status(404).json({ message: 'Institutes not found' });

    res.status(200).json(institutes);
});
