import User from '../models/auth.model.js';
import Institution from '../models/institution.model.js';
import Parameter from '../models/institution_parameter.model.js';
import ParameterTemplate from '../models/parameter_template.model.js';
import Application from '../models/application.model.js';
import Document from '../models/document.model.js';
import bcrypt from 'bcrypt';
import { asyncHandler } from '../services/asyncHandler.js';

// ==================== USER MANAGEMENT ====================

// Get all users
export const getAllUsers = asyncHandler(async (req, res) => {
    const { role, search } = req.query;
    let query = {};

    if (role && role !== 'all') {
        query.role = role;
    }

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ];
    }

    const users = await User.find(query).select('-password').sort({ created_at: -1 });
    
    res.status(200).json({
        success: true,
        count: users.length,
        data: users
    });
});

// Get single user
export const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
        success: true,
        data: user
    });
});

// Create new user
export const createUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role
    });

    res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

// Update user
export const updateUser = asyncHandler(async (req, res) => {
    const { name, email, role, password } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (email) {
        // Check if email already exists for another user
        const existingUser = await User.findOne({ email, _id: { $ne: userId } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        user.email = email;
    }
    if (role) user.role = role;
    
    // Update password if provided
    if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

// Delete user
export const deleteUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    // Prevent super admin from deleting themselves
    if (userId === req.user.id) {
        return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // If deleting an institution user, also delete their institution data
    if (user.role === 'institution') {
        await Institution.deleteMany({ user_id: userId });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
        success: true,
        message: 'User deleted successfully'
    });
});

// ==================== INSTITUTION MANAGEMENT ====================

// Get all institutions
export const getAllInstitutions = asyncHandler(async (req, res) => {
    const { type, search } = req.query;
    let query = {};

    if (type && type !== 'all') {
        query.type = type;
    }

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { institution_code: { $regex: search, $options: 'i' } }
        ];
    }

    const institutions = await Institution.find(query)
        .populate('user_id', 'name email role')
        .sort({ createdAt: -1 });
    
    res.status(200).json({
        success: true,
        count: institutions.length,
        data: institutions
    });
});

// Get single institution with full details
export const getInstitutionById = asyncHandler(async (req, res) => {
    const institution = await Institution.findById(req.params.id)
        .populate('user_id', 'name email role')
        .populate('parameters')
        .populate('documents')
        .populate('applications');
    
    if (!institution) {
        return res.status(404).json({ message: 'Institution not found' });
    }

    res.status(200).json({
        success: true,
        data: institution
    });
});

// Create institution
export const createInstitution = asyncHandler(async (req, res) => {
    const institutionData = req.body;

    // Validate required fields
    if (!institutionData.user_id || !institutionData.name || !institutionData.email || !institutionData.type) {
        return res.status(400).json({ message: 'user_id, name, email, and type are required' });
    }

    // Check if user exists and is of institution role
    const user = await User.findById(institutionData.user_id);
    if (!user || user.role !== 'institution') {
        return res.status(400).json({ message: 'Invalid user or user is not an institution' });
    }

    // Check if institution with same email already exists
    const existingInstitution = await Institution.findOne({ email: institutionData.email });
    if (existingInstitution) {
        return res.status(400).json({ message: 'Institution with this email already exists' });
    }

    const institution = await Institution.create(institutionData);

    res.status(201).json({
        success: true,
        message: 'Institution created successfully',
        data: institution
    });
});

// Update institution
export const updateInstitution = asyncHandler(async (req, res) => {
    const institutionId = req.params.id;
    const updateData = req.body;

    const institution = await Institution.findByIdAndUpdate(
        institutionId,
        updateData,
        { new: true, runValidators: true }
    );

    if (!institution) {
        return res.status(404).json({ message: 'Institution not found' });
    }

    res.status(200).json({
        success: true,
        message: 'Institution updated successfully',
        data: institution
    });
});

// Delete institution
export const deleteInstitution = asyncHandler(async (req, res) => {
    const institutionId = req.params.id;

    const institution = await Institution.findById(institutionId);
    if (!institution) {
        return res.status(404).json({ message: 'Institution not found' });
    }

    // Delete related data
    await Parameter.deleteMany({ institution_id: institutionId });
    await Document.deleteMany({ institution_id: institutionId });
    await Application.deleteMany({ institution_id: institutionId });

    await Institution.findByIdAndDelete(institutionId);

    res.status(200).json({
        success: true,
        message: 'Institution and related data deleted successfully'
    });
});

// ==================== PARAMETER TEMPLATE MANAGEMENT ====================

// Get all parameter templates
export const getAllParameterTemplates = asyncHandler(async (req, res) => {
    const { category, search, is_active } = req.query;
    let query = {};

    if (category) {
        query.parameter_category = category;
    }

    if (is_active !== undefined) {
        query.is_active = is_active === 'true';
    }

    if (search) {
        query.$or = [
            { parameter_name: { $regex: search, $options: 'i' } },
            { parameter_category: { $regex: search, $options: 'i' } }
        ];
    }

    console.log('Fetching parameter templates with query:', query);
    const templates = await ParameterTemplate.find(query).sort({ parameter_category: 1, parameter_name: 1 });
    console.log('Found templates:', templates.length);
    
    res.status(200).json({
        success: true,
        count: templates.length,
        data: templates
    });
});

// Get single parameter template
export const getParameterTemplateById = asyncHandler(async (req, res) => {
    const template = await ParameterTemplate.findById(req.params.id);
    
    if (!template) {
        return res.status(404).json({ message: 'Parameter template not found' });
    }

    res.status(200).json({
        success: true,
        data: template
    });
});

// Create parameter template
export const createParameterTemplate = asyncHandler(async (req, res) => {
    const { parameter_category, parameter_name, norm_value, authority, criticality, description } = req.body;

    if (!parameter_category || !parameter_name || !norm_value || !authority) {
        return res.status(400).json({ message: 'parameter_category, parameter_name, norm_value, and authority are required' });
    }

    // Check if template with same name already exists
    const existingTemplate = await ParameterTemplate.findOne({ parameter_name });
    if (existingTemplate) {
        return res.status(400).json({ message: 'Parameter template with this name already exists' });
    }

    const template = await ParameterTemplate.create({
        parameter_category,
        parameter_name,
        norm_value,
        authority,
        criticality: criticality || 'medium',
        description
    });

    res.status(201).json({
        success: true,
        message: 'Parameter template created successfully. This will now be available to all institutions.',
        data: template
    });
});

// Update parameter template
export const updateParameterTemplate = asyncHandler(async (req, res) => {
    const templateId = req.params.id;
    const updateData = req.body;

    const template = await ParameterTemplate.findByIdAndUpdate(
        templateId,
        updateData,
        { new: true, runValidators: true }
    );

    if (!template) {
        return res.status(404).json({ message: 'Parameter template not found' });
    }

    res.status(200).json({
        success: true,
        message: 'Parameter template updated successfully',
        data: template
    });
});

// Delete parameter template
export const deleteParameterTemplate = asyncHandler(async (req, res) => {
    const templateId = req.params.id;

    const template = await ParameterTemplate.findById(templateId);
    if (!template) {
        return res.status(404).json({ message: 'Parameter template not found' });
    }

    // Check if any institutions are using this template
    const usageCount = await Parameter.countDocuments({ parameter_template_id: templateId });
    
    if (usageCount > 0) {
        return res.status(400).json({ 
            message: `Cannot delete template. It is being used by ${usageCount} institution(s). Consider deactivating instead.` 
        });
    }

    await ParameterTemplate.findByIdAndDelete(templateId);

    res.status(200).json({
        success: true,
        message: 'Parameter template deleted successfully'
    });
});

// Toggle parameter template active status
export const toggleParameterTemplateStatus = asyncHandler(async (req, res) => {
    const templateId = req.params.id;

    const template = await ParameterTemplate.findById(templateId);
    if (!template) {
        return res.status(404).json({ message: 'Parameter template not found' });
    }

    template.is_active = !template.is_active;
    await template.save();

    res.status(200).json({
        success: true,
        message: `Parameter template ${template.is_active ? 'activated' : 'deactivated'} successfully`,
        data: template
    });
});

// Bulk create parameter templates
export const bulkCreateParameterTemplates = asyncHandler(async (req, res) => {
    const { templates } = req.body;

    if (!templates || !Array.isArray(templates) || templates.length === 0) {
        return res.status(400).json({ message: 'templates array is required' });
    }

    // Validate all templates have required fields
    for (const template of templates) {
        if (!template.parameter_category || !template.parameter_name || !template.norm_value || !template.authority) {
            return res.status(400).json({ 
                message: 'All templates must have parameter_category, parameter_name, norm_value, and authority' 
            });
        }
    }

    const createdTemplates = await ParameterTemplate.insertMany(templates, { ordered: false }).catch(err => {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Some parameter names already exist' });
        }
        throw err;
    });

    res.status(201).json({
        success: true,
        message: `${createdTemplates.length} parameter templates created successfully`,
        data: createdTemplates
    });
});

// ==================== DASHBOARD STATISTICS ====================

export const getDashboardStats = asyncHandler(async (req, res) => {
    // Get time-series data for institutions approved over time (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    
    const institutionsApprovedOverTime = await Application.aggregate([
        {
            $match: {
                status: 'approved'
            }
        },
        {
            $addFields: {
                approvalDate: { $ifNull: ['$updatedAt', '$submitted_at'] }
            }
        },
        {
            $match: {
                approvalDate: { $gte: twelveMonthsAgo }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$approvalDate' },
                    month: { $month: '$approvalDate' }
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { '_id.year': 1, '_id.month': 1 }
        }
    ]);

    // Get applications received over time (all submitted applications)
    const applicationsReceivedOverTime = await Application.aggregate([
        {
            $match: {
                submitted_at: { $gte: twelveMonthsAgo }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$submitted_at' },
                    month: { $month: '$submitted_at' }
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { '_id.year': 1, '_id.month': 1 }
        }
    ]);

    console.log('Dashboard Stats - Institutions Approved Over Time:', institutionsApprovedOverTime);
    console.log('Dashboard Stats - Applications Received Over Time:', applicationsReceivedOverTime);
    console.log('Total approved applications:', await Application.countDocuments({ status: 'approved' }));

    const [
        totalUsers,
        totalInstitutions,
        totalApplications,
        totalParameterTemplates,
        approvedApplications,
        rejectedApplications,
        pendingApplications,
        usersByRole,
        institutionsByType,
        recentUsers,
        recentInstitutions
    ] = await Promise.all([
        User.countDocuments(),
        Institution.countDocuments(),
        Application.countDocuments(),
        ParameterTemplate.countDocuments({ is_active: true }),
        Application.countDocuments({ status: 'approved' }),
        Application.countDocuments({ status: 'rejected' }),
        Application.countDocuments({ status: 'pending' }),
        User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]),
        Institution.aggregate([
            { $group: { _id: '$type', count: { $sum: 1 } } }
        ]),
        User.find().select('-password').sort({ created_at: -1 }).limit(5),
        Institution.find().populate('user_id', 'name email').sort({ createdAt: -1 }).limit(5)
    ]);

    res.status(200).json({
        success: true,
        data: {
            overview: {
                totalUsers,
                totalInstitutions,
                totalApplications,
                totalParameters: totalParameterTemplates,
                approvedApplications,
                rejectedApplications,
                pendingApplications
            },
            usersByRole: usersByRole.reduce((acc, curr) => {
                acc[curr._id] = curr.count;
                return acc;
            }, {}),
            institutionsByType: institutionsByType.reduce((acc, curr) => {
                acc[curr._id] = curr.count;
                return acc;
            }, {}),
            institutionsApprovedOverTime: institutionsApprovedOverTime.map(item => ({
                month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
                count: item.count
            })),
            applicationsReceivedOverTime: applicationsReceivedOverTime.map(item => ({
                month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
                count: item.count
            })),
            recentUsers,
            recentInstitutions
        }
    });
});
