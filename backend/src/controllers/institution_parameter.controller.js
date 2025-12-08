import { asyncHandler } from '../services/asyncHandler.js';
import Parameter from '../models/institution_parameter.model.js';
import ParameterTemplate from '../models/parameter_template.model.js';
import Institution from '../models/institution.model.js';

// Get all active parameter templates for institutions
export const getActiveParameterTemplates = asyncHandler(async (req, res) => {
    const templates = await ParameterTemplate.find({ is_active: true })
        .sort({ parameter_category: 1, parameter_name: 1 })
        .select('parameter_category parameter_name norm_value authority criticality description');
    
    res.status(200).json({
        success: true,
        count: templates.length,
        data: templates
    });
});

// Get institution's parameter values merged with templates
export const getInstitutionParameters = asyncHandler(async (req, res) => {
    const { institution_id } = req.params;
    
    // Get all active templates
    const templates = await ParameterTemplate.find({ is_active: true })
        .sort({ parameter_category: 1, parameter_name: 1 });
    
    // Get institution's existing parameter values
    const institutionParams = await Parameter.find({ institution_id })
        .populate('parameter_template_id');
    
    // Create a map of template_id -> institution values
    const paramMap = {};
    institutionParams.forEach(param => {
        if (param.parameter_template_id) {
            paramMap[param.parameter_template_id._id.toString()] = {
                _id: param._id,
                institution_value: param.institution_value,
                is_compliant: param.is_compliant,
                remarks: param.remarks
            };
        }
    });
    
    // Merge templates with institution values
    const mergedData = templates.map(template => ({
        template_id: template._id,
        parameter_category: template.parameter_category,
        parameter_name: template.parameter_name,
        norm_value: template.norm_value,
        authority: template.authority,
        criticality: template.criticality,
        description: template.description,
        parameter_record_id: paramMap[template._id.toString()]?._id || null,
        institution_value: paramMap[template._id.toString()]?.institution_value || '',
        is_compliant: paramMap[template._id.toString()]?.is_compliant || false,
        remarks: paramMap[template._id.toString()]?.remarks || ''
    }));
    
    res.status(200).json({
        success: true,
        count: mergedData.length,
        data: mergedData
    });
});


// Save or update institution parameter values (using templates)
export const saveInstitutionParameterValues = asyncHandler(async (req, res) => {
    const { institution_id, parameters } = req.body;

    if (!parameters || !Array.isArray(parameters)) {
        return res.status(400).json({
            success: false,
            message: 'parameters must be an array with parameter_template_id and institution_value',
        });
    }

    const operations = [];
    const parameterIds = [];

    for (const param of parameters) {
        const { parameter_template_id, institution_value, is_compliant, remarks } = param;

        if (!parameter_template_id) {
            continue; // Skip if no template_id
        }

        // Verify template exists and is active
        const template = await ParameterTemplate.findOne({ _id: parameter_template_id, is_active: true });
        if (!template) {
            continue; // Skip if template doesn't exist or is inactive
        }

        operations.push({
            updateOne: {
                filter: { institution_id, parameter_template_id },
                update: {
                    $set: {
                        institution_value: institution_value || '',
                        is_compliant: is_compliant || false,
                        remarks: remarks || ''
                    }
                },
                upsert: true
            }
        });
    }

    if (operations.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'No valid parameters to save'
        });
    }

    const result = await Parameter.bulkWrite(operations);

    // Get the created/updated parameter IDs
    const savedParams = await Parameter.find({ institution_id }).select('_id');
    const paramIds = savedParams.map(p => p._id);

    // Update institution with parameter references
    await Institution.findByIdAndUpdate(institution_id, {
        $set: { parameters: paramIds }
    });

    return res.status(200).json({
        success: true,
        message: 'Parameter values saved successfully',
        upserted: result.upsertedCount,
        modified: result.modifiedCount
    });
});

// Legacy: create parameter (kept for backward compatibility)
export const createParameters = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { institution_id, parameters } = req.body;

    if (!parameters || !Array.isArray(parameters)) {
        return res.status(400).json({
            success: false,
            message: 'parameters must be an array',
        });
    }

    const existing = await Parameter.findOne({ institution_id });

    if (existing) {
        await Parameter.deleteMany({ institution_id });
        console.log('Existing parameters deleted for institution:', institution_id);
        await Institution.findByIdAndUpdate(institution_id, { $set: { parameters: [] } });
    }

    const createdParams = await Parameter.insertMany(
        parameters.map((p) => ({ ...p, institution_id }))
    );

    await Institution.findByIdAndUpdate(institution_id, {
        $push: { parameters: createdParams.map((p) => p._id) },
    });

    return res.status(201).json({
        success: true,
        message: 'Parameters saved',
        createdParams,
    });
});


// update the parameter
export const updateMultipleParameters = asyncHandler(async (req, res) => {
    const { institution_id, updates } = req.body;

    if (!updates || !Array.isArray(updates)) {
        return res.status(400).json({
            success: false,
            message: 'updates must be an array',
        });
    }

    // Extract all Mongo IDs correctly
    const ids = updates.map((u) => u._id);

    // Check only institution-owned parameters can be updated
    const allowedParams = await Parameter.find({
        _id: { $in: ids },
        institution_id,
    }).select('_id');

    const allowedIds = allowedParams.map((p) => p._id.toString());

    // Prepare safe update operations
    const operations = updates
        .filter((u) => allowedIds.includes(u._id))
        .map((u) => {
            const { _id, ...rest } = u; // remove id
            return {
                updateOne: {
                    filter: { _id },
                    update: { $set: { ...rest, updatedAt: new Date() } },
                },
            };
        });

    if (operations.length === 0) {
        return res.status(403).json({
            success: false,
            message: 'No parameters belong to your institution',
        });
    }

    const result = await Parameter.bulkWrite(operations);

    return res.status(200).json({
        success: true,
        message: 'Multiple parameters updated successfully',
        totalUpdated: result.modifiedCount,
        invalidOrUnauthorized: ids.filter((id) => !allowedIds.includes(id)),
    });
});



// export const updateSingleParameter = asyncHandler(async (req, res) => {
//   const { id } = req.params.id; // parameter id
//   const {
//     parameter_category,
//     parameter_name,
//     norm_value,
//     institution_value,
//     authority,
//     criticality,
//     is_compliant,
//   } = req.body;

//   // Check parameter exists
//   const parameter = await Parameter.findById(id);
//   if (!parameter)
//     return res.status(404).json({ message: "Parameter not found" });

//   // Check if parameter belongs to logged-in institution
//   if (parameter.institution_id.toString() !== req.user.institution_id.toString()) {
//     return res.status(403).json({ message: "Unauthorized" });
//   }

//   // Update fields only if provided
//   if (parameter_category !== undefined) parameter.parameter_category = parameter_category;
//   if (parameter_name !== undefined) parameter.parameter_name = parameter_name;
//   if (norm_value !== undefined) parameter.norm_value = norm_value;
//   if (institution_value !== undefined) parameter.institution_value = institution_value;
//   if (authority !== undefined) parameter.authority = authority;
//   if (criticality !== undefined) parameter.criticality = criticality;
//   if (is_compliant !== undefined) parameter.is_compliant = is_compliant;

//   await parameter.save();

//   return res.status(200).json({
//     success: true,
//     message: "Parameter updated successfully",
//     parameter,
//   });
// });
