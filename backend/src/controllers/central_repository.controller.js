import Institution from '../models/institution.model.js';
import InstitutionParameter from '../models/institution_parameter.model.js';
import Application from '../models/application.model.js';
import AIAnalysis from '../models/ai_analysis.model.js';
import AIReport from '../models/ai_report.model.js';
import Document from '../models/document.model.js';

/**
 * Central Repository Controller
 * Provides unified API endpoints for external services to fetch institution data
 */

// Get all institutions with basic details
export const getAllInstitutions = async (req, res) => {
  try {
    const { 
      type, 
      status, 
      search, 
      page = 1, 
      limit = 50,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = {};
    
    // If user is restricted to own institution
    if (req.institutionFilter) {
      filter._id = req.institutionFilter;
    }
    
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { contact_email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const institutions = await Institution.find(filter)
      .select('-password')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Institution.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Institutions fetched successfully',
      data: institutions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      auth: {
        role: req.auth?.role,
        type: req.auth?.type
      }
    });
  } catch (error) {
    console.error('Error fetching institutions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching institutions',
      error: error.message
    });
  }
};

// Get detailed institution data by ID or name
export const getInstitutionDetails = async (req, res) => {
  try {
    const { identifier } = req.params;
    const { includeParameters, includeApplications, includeAIData, includeDocuments } = req.query;

    let institution;
    
    // Check if identifier is ObjectId or institution name
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      institution = await Institution.findById(identifier).select('-password');
    } else {
      institution = await Institution.findOne({ 
        name: { $regex: new RegExp(`^${identifier}$`, 'i') }
      }).select('-password');
    }

    if (!institution) {
      return res.status(404).json({
        success: false,
        message: 'Institution not found'
      });
    }

    const response = {
      institution
    };

    // Check permissions for each data type
    const permissions = req.auth?.permissions || {};

    // Include parameters if requested and allowed
    if (includeParameters === 'true' && permissions.canReadParameters) {
      const parameters = await InstitutionParameter.find({ 
        institution_id: institution._id 
      }).populate('parameter_template_id');
      response.parameters = parameters;
    }

    // Include applications if requested and allowed
    if (includeApplications === 'true' && permissions.canReadApplications) {
      const applications = await Application.find({ 
        institution_id: institution._id 
      }).sort({ createdAt: -1 });
      response.applications = applications;
    }

    // Include AI data if requested and allowed
    if (includeAIData === 'true' && permissions.canReadAIData) {
      const aiAnalysis = await AIAnalysis.find({ 
        institution_id: institution._id 
      }).sort({ createdAt: -1 });
      const aiReports = await AIReport.find({ 
        institution_id: institution._id 
      }).sort({ createdAt: -1 });
      response.aiAnalysis = aiAnalysis;
      response.aiReports = aiReports;
    }

    // Include documents if requested and allowed
    if (includeDocuments === 'true' && permissions.canReadDocuments) {
      const documents = await Document.find({ 
        institution_id: institution._id 
      }).sort({ createdAt: -1 });
      response.documents = documents;
    }

    res.status(200).json({
      success: true,
      message: 'Institution details fetched successfully',
      data: response,
      auth: {
        role: req.auth?.role,
        type: req.auth?.type
      }
    });
  } catch (error) {
    console.error('Error fetching institution details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching institution details',
      error: error.message
    });
  }
};

// Get application status and history
export const getApplicationStatus = async (req, res) => {
  try {
    const { institutionId, applicationId } = req.params;

    let query = {};
    
    if (applicationId) {
      query._id = applicationId;
    } else if (institutionId) {
      query.institution_id = institutionId;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Either institutionId or applicationId is required'
      });
    }

    const applications = await Application.find(query)
      .populate('institution_id', 'name type location')
      .sort({ createdAt: -1 });

    if (!applications || applications.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No applications found'
      });
    }

    // Get AI analysis and reports for these applications
    const enrichedApplications = await Promise.all(
      applications.map(async (app) => {
        const aiAnalysis = await AIAnalysis.findOne({ 
          application_id: app._id 
        }).sort({ createdAt: -1 });
        
        const aiReport = await AIReport.findOne({ 
          application_id: app._id 
        }).sort({ createdAt: -1 });

        return {
          ...app.toObject(),
          latestAIAnalysis: aiAnalysis,
          latestAIReport: aiReport
        };
      })
    );

    res.status(200).json({
      success: true,
      message: 'Application status fetched successfully',
      data: enrichedApplications
    });
  } catch (error) {
    console.error('Error fetching application status:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching application status',
      error: error.message
    });
  }
};

// Query institutions by parameters
export const queryByParameters = async (req, res) => {
  try {
    const { parameters, operator = 'AND' } = req.body;

    if (!parameters || !Array.isArray(parameters) || parameters.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Parameters array is required'
      });
    }

    // Find institutions matching the parameter criteria
    const institutionIds = new Set();
    
    for (const param of parameters) {
      const { parameterName, value, condition = 'equals' } = param;
      
      let query = {
        'parameter_template_id.parameter_name': parameterName
      };

      // Apply condition
      switch (condition) {
        case 'equals':
          query.parameter_value = value;
          break;
        case 'contains':
          query.parameter_value = { $regex: value, $options: 'i' };
          break;
        case 'greaterThan':
          query.parameter_value = { $gt: parseFloat(value) };
          break;
        case 'lessThan':
          query.parameter_value = { $lt: parseFloat(value) };
          break;
        default:
          query.parameter_value = value;
      }

      const matchingParams = await InstitutionParameter.find(query)
        .populate('parameter_template_id')
        .populate('institution_id');

      if (operator === 'AND') {
        if (institutionIds.size === 0) {
          matchingParams.forEach(p => institutionIds.add(p.institution_id._id.toString()));
        } else {
          const currentIds = new Set(matchingParams.map(p => p.institution_id._id.toString()));
          // Keep only institutions that match all criteria
          institutionIds.forEach(id => {
            if (!currentIds.has(id)) institutionIds.delete(id);
          });
        }
      } else {
        // OR operation
        matchingParams.forEach(p => institutionIds.add(p.institution_id._id.toString()));
      }
    }

    const institutions = await Institution.find({
      _id: { $in: Array.from(institutionIds) }
    }).select('-password');

    res.status(200).json({
      success: true,
      message: `Found ${institutions.length} institutions matching criteria`,
      data: institutions,
      criteria: { parameters, operator }
    });
  } catch (error) {
    console.error('Error querying by parameters:', error);
    res.status(500).json({
      success: false,
      message: 'Error querying institutions',
      error: error.message
    });
  }
};

// Get aggregated statistics
export const getStatistics = async (req, res) => {
  try {
    const { institutionId } = req.query;

    let filter = {};
    if (institutionId) {
      filter = { institution_id: institutionId };
    }

    // Get counts
    const totalInstitutions = await Institution.countDocuments(institutionId ? { _id: institutionId } : {});
    const totalApplications = await Application.countDocuments(filter);
    const totalParameters = await InstitutionParameter.countDocuments(filter);
    const totalDocuments = await Document.countDocuments(filter);

    // Application status breakdown
    const applicationsByStatus = await Application.aggregate([
      ...(institutionId ? [{ $match: filter }] : []),
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // AI Analysis statistics
    const aiAnalysisStats = await AIAnalysis.aggregate([
      ...(institutionId ? [{ $match: filter }] : []),
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$ai_total_score' },
          maxScore: { $max: '$ai_total_score' },
          minScore: { $min: '$ai_total_score' },
          totalAnalyses: { $sum: 1 }
        }
      }
    ]);

    // Institution types breakdown
    const institutionsByType = await Institution.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      message: 'Statistics fetched successfully',
      data: {
        overview: {
          totalInstitutions,
          totalApplications,
          totalParameters,
          totalDocuments
        },
        applicationsByStatus: applicationsByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        aiAnalysis: aiAnalysisStats[0] || {
          avgScore: 0,
          maxScore: 0,
          minScore: 0,
          totalAnalyses: 0
        },
        institutionsByType: institutionsByType.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

// Bulk query endpoint for multiple institutions
export const bulkQuery = async (req, res) => {
  try {
    const { institutionIds, fields } = req.body;

    if (!institutionIds || !Array.isArray(institutionIds)) {
      return res.status(400).json({
        success: false,
        message: 'institutionIds array is required'
      });
    }

    const results = await Promise.all(
      institutionIds.map(async (id) => {
        try {
          const institution = await Institution.findById(id).select('-password');
          
          if (!institution) {
            return { id, error: 'Institution not found' };
          }

          const data = { institution };

          if (fields?.includes('parameters')) {
            data.parameters = await InstitutionParameter.find({ 
              institution_id: id 
            }).populate('parameter_template_id');
          }

          if (fields?.includes('applications')) {
            data.applications = await Application.find({ 
              institution_id: id 
            }).sort({ createdAt: -1 }).limit(10);
          }

          if (fields?.includes('aiData')) {
            data.latestAIAnalysis = await AIAnalysis.findOne({ 
              institution_id: id 
            }).sort({ createdAt: -1 });
            data.latestAIReport = await AIReport.findOne({ 
              institution_id: id 
            }).sort({ createdAt: -1 });
          }

          return { id, data };
        } catch (err) {
          return { id, error: err.message };
        }
      })
    );

    res.status(200).json({
      success: true,
      message: 'Bulk query completed',
      results
    });
  } catch (error) {
    console.error('Error in bulk query:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing bulk query',
      error: error.message
    });
  }
};

// Get parameter templates (available parameters for all institutions)
export const getParameterTemplates = async (req, res) => {
  try {
    const ParameterTemplate = (await import('../models/parameter_template.model.js')).default;
    
    const { category } = req.query;
    const filter = category ? { category } : {};

    const templates = await ParameterTemplate.find(filter).sort({ category: 1, parameter_name: 1 });

    res.status(200).json({
      success: true,
      message: 'Parameter templates fetched successfully',
      data: templates
    });
  } catch (error) {
    console.error('Error fetching parameter templates:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching parameter templates',
      error: error.message
    });
  }
};

export default {
  getAllInstitutions,
  getInstitutionDetails,
  getApplicationStatus,
  queryByParameters,
  getStatistics,
  bulkQuery,
  getParameterTemplates
};
