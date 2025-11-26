import { asyncHandler } from '../services/asyncHandler.js';
import Parameter from '../models/institution_parameter.model.js';
import Institution from '../models/institution.model.js';


// create parameter
export const createParameters = asyncHandler(async (req, res) => {
    const { institution_id, parameters } = req.body;

    if (!parameters || !Array.isArray(parameters)) {
        return res.status(400).json({
            success: false,
            message: 'parameters must be an array',
        });
    }

    const existing = await Parameter.findOne({ institution_id });

    if (existing) {
        return res.status(400).json({
            success: false,
            message:
                'Parameters already exist for this institution. Cannot add again.',
        });
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
