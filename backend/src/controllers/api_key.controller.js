import {
  generateApiKey,
  addApiKey,
  revokeApiKey,
  listApiKeys,
  PERMISSIONS
} from '../middlewares/centralRepoAuth.middleware.js';

/**
 * API Key Management Controller
 * Allows Super Admin to manage API keys for central repository access
 */

// Generate new API key
export const generateNewApiKey = async (req, res) => {
  try {
    const { service, role, customPermissions, expiresAt, notes } = req.body;

    if (!service || !role) {
      return res.status(400).json({
        success: false,
        message: 'Service name and role are required'
      });
    }

    // Validate role
    const validRoles = ['public', 'external_service', 'institution', 'aicte_admin', 'ugc_admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Must be one of: ${validRoles.join(', ')}`
      });
    }

    const key = generateApiKey();
    const permissions = customPermissions || PERMISSIONS[role];
    
    const apiKeyData = await addApiKey({
      key,
      service,
      role,
      customPermissions: permissions,
      createdBy: req.user?.id || null,
      institutionId: req.body.institutionId || null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      notes: notes || ''
    });

    res.status(201).json({
      success: true,
      message: 'API key generated successfully',
      data: {
        key: apiKeyData.key,
        service: apiKeyData.service,
        role: apiKeyData.role,
        permissions: apiKeyData.permissions,
        id: apiKeyData.id,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error generating API key:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating API key',
      error: error.message
    });
  }
};

// List all API keys
export const getAllApiKeys = async (req, res) => {
  try {
    const keys = await listApiKeys();

    res.status(200).json({
      success: true,
      message: 'API keys fetched successfully',
      data: keys,
      total: keys.length
    });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching API keys',
      error: error.message
    });
  }
};

// Revoke API key
export const revokeApiKeyById = async (req, res) => {
  try {
    const { key } = req.body;

    if (!key) {
      return res.status(400).json({
        success: false,
        message: 'API key is required'
      });
    }

    const success = await revokeApiKey(key);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'API key not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'API key revoked successfully'
    });
  } catch (error) {
    console.error('Error revoking API key:', error);
    res.status(500).json({
      success: false,
      message: 'Error revoking API key',
      error: error.message
    });
  }
};

// Get available roles and their permissions
export const getAvailableRoles = async (req, res) => {
  try {
    const roles = Object.keys(PERMISSIONS).map(role => ({
      role,
      permissions: PERMISSIONS[role],
      description: getRoleDescription(role)
    }));

    res.status(200).json({
      success: true,
      message: 'Available roles fetched successfully',
      data: roles
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching roles',
      error: error.message
    });
  }
};

// Helper function to get role descriptions
function getRoleDescription(role) {
  const descriptions = {
    'super_admin': 'Full access to all data and operations',
    'aicte_admin': 'Can view and manage all institutions and applications',
    'ugc_admin': 'Can view and manage all institutions and applications',
    'institution': 'Can only view their own institution data',
    'external_service': 'Configurable access for external services',
    'public': 'Read-only access to basic institution information'
  };
  return descriptions[role] || 'No description available';
}

export default {
  generateNewApiKey,
  getAllApiKeys,
  revokeApiKeyById,
  getAvailableRoles
};
