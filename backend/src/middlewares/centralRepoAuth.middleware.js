import jwt from 'jsonwebtoken';
import User from '../models/auth.model.js';
import ApiKey from '../models/api_key.model.js';

/**
 * Central Repository Authentication & Authorization Middleware
 * Supports both JWT tokens (for logged-in users) and API keys (for external services)
 */

// Role-based permissions configuration
export const PERMISSIONS = {
  // Super Admin - Full access to everything
  'super_admin': {
    canReadInstitutions: true,
    canReadParameters: true,
    canReadApplications: true,
    canReadAIData: true,
    canReadDocuments: true,
    canQueryByParameters: true,
    canBulkQuery: true,
    canReadStatistics: true,
    canReadAllInstitutions: true
  },
  
  // AICTE Admin - Can view all institutions and applications
  'aicte_admin': {
    canReadInstitutions: true,
    canReadParameters: true,
    canReadApplications: true,
    canReadAIData: true,
    canReadDocuments: true,
    canQueryByParameters: true,
    canBulkQuery: true,
    canReadStatistics: true,
    canReadAllInstitutions: true
  },
  
  // UGC Admin - Similar to AICTE
  'ugc_admin': {
    canReadInstitutions: true,
    canReadParameters: true,
    canReadApplications: true,
    canReadAIData: true,
    canReadDocuments: true,
    canQueryByParameters: true,
    canBulkQuery: true,
    canReadStatistics: true,
    canReadAllInstitutions: true
  },
  
  // Institution - Can only view their own data
  'institution': {
    canReadInstitutions: false,
    canReadParameters: true,
    canReadApplications: true,
    canReadAIData: true,
    canReadDocuments: true,
    canQueryByParameters: false,
    canBulkQuery: false,
    canReadStatistics: false,
    canReadAllInstitutions: false,
    ownDataOnly: true
  },
  
  // External Service (API Key) - Configurable access
  'external_service': {
    canReadInstitutions: true,
    canReadParameters: true,
    canReadApplications: true,
    canReadAIData: false,
    canReadDocuments: false,
    canQueryByParameters: true,
    canBulkQuery: true,
    canReadStatistics: true,
    canReadAllInstitutions: true
  },
  
  // Public (Read-only) - Very limited access
  'public': {
    canReadInstitutions: true,
    canReadParameters: false,
    canReadApplications: false,
    canReadAIData: false,
    canReadDocuments: false,
    canQueryByParameters: false,
    canBulkQuery: false,
    canReadStatistics: true,
    canReadAllInstitutions: true
  }
};

/**
 * Authenticate user via JWT token or API key
 */
export const authenticateCentralRepo = async (req, res, next) => {
  try {
    // Check for API Key first
    const apiKey = req.header('X-API-Key') || req.query.apiKey;
    
    if (apiKey) {
      // Lookup API key from database
      const keyInfo = await ApiKey.findActiveKey(apiKey);
      
      if (!keyInfo) {
        return res.status(403).json({
          success: false,
          message: 'Invalid or expired API key'
        });
      }
      
      // Record usage asynchronously
      keyInfo.recordUsage().catch(err => console.error('Failed to record API key usage:', err));
      
      // Attach API key info to request
      req.auth = {
        type: 'api_key',
        role: keyInfo.role,
        service: keyInfo.service,
        permissions: keyInfo.permissions,
        institutionId: keyInfo.institutionId || null,
        apiKeyId: keyInfo._id
      };
      
      return next();
    }
    
    // Check for JWT token (for logged-in users)
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      // Allow public access with limited permissions
      req.auth = {
        type: 'public',
        role: 'public',
        permissions: PERMISSIONS.public,
        institutionId: null
      };
      return next();
    }
    
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get permissions based on user role
    const permissions = PERMISSIONS[user.role] || PERMISSIONS.public;
    
    req.auth = {
      type: 'jwt',
      userId: user._id,
      role: user.role,
      permissions: permissions,
      institutionId: user.institution_id || null,
      user: user
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    // If JWT is invalid, treat as public access
    req.auth = {
      type: 'public',
      role: 'public',
      permissions: PERMISSIONS.public,
      institutionId: null
    };
    next();
  }
};

/**
 * Check if user has specific permission
 */
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.auth) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    if (!req.auth.permissions[permission]) {
      return res.status(403).json({
        success: false,
        message: `Permission denied. Required: ${permission}`,
        yourRole: req.auth.role
      });
    }
    
    next();
  };
};

/**
 * Filter data based on user permissions
 * Institutions can only see their own data
 */
export const filterByInstitution = (req, res, next) => {
  if (!req.auth) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  // If user has ownDataOnly restriction, add institution filter
  if (req.auth.permissions.ownDataOnly && req.auth.institutionId) {
    // Add institution filter to query
    req.institutionFilter = req.auth.institutionId;
  }
  
  next();
};

/**
 * Restrict access to own institution data
 */
export const restrictToOwnInstitution = (req, res, next) => {
  if (!req.auth) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  const { identifier, institutionId } = req.params;
  
  // If user is restricted to own data only
  if (req.auth.permissions.ownDataOnly && req.auth.institutionId) {
    // Check if trying to access own institution
    if (identifier && identifier !== req.auth.institutionId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own institution data.'
      });
    }
    
    if (institutionId && institutionId !== req.auth.institutionId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own institution data.'
      });
    }
  }
  
  next();
};

/**
 * Log API access for audit purposes
 */
export const logApiAccess = (req, res, next) => {
  const logData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    authType: req.auth?.type || 'none',
    role: req.auth?.role || 'public',
    service: req.auth?.service || 'N/A',
    userId: req.auth?.userId || 'N/A',
    institutionId: req.auth?.institutionId || 'N/A',
    ip: req.ip,
    userAgent: req.get('user-agent')
  };
  
  console.log('[Central Repository Access]', JSON.stringify(logData));
  next();
};

/**
 * Add API key management functions
 */
export const addApiKey = async (keyData) => {
  const { key, service, role, customPermissions, createdBy, institutionId, expiresAt, notes } = keyData;
  
  // Use custom permissions or default based on role
  const permissions = customPermissions || PERMISSIONS[role] || PERMISSIONS.public;
  
  const apiKey = new ApiKey({
    key,
    service,
    role,
    permissions,
    createdBy,
    institutionId: institutionId || null,
    expiresAt: expiresAt || null,
    notes: notes || ''
  });
  
  await apiKey.save();
  
  return {
    key: apiKey.key,
    service: apiKey.service,
    role: apiKey.role,
    permissions: apiKey.permissions,
    id: apiKey._id
  };
};

export const revokeApiKey = async (key) => {
  const apiKey = await ApiKey.findOne({ key });
  if (!apiKey) return false;
  
  apiKey.isActive = false;
  await apiKey.save();
  return true;
};

export const listApiKeys = async (filters = {}) => {
  const query = { isActive: true, ...filters };
  const keys = await ApiKey.find(query)
    .sort({ createdAt: -1 })
    .select('-__v')
    .lean();
  
  return keys.map(keyInfo => ({
    key: keyInfo.key.substring(0, 12) + '...',  // Display key (truncated)
    fullKey: keyInfo.key,  // Full key for revocation
    service: keyInfo.service,
    role: keyInfo.role,
    permissions: keyInfo.permissions,
    createdAt: keyInfo.createdAt,
    lastUsed: keyInfo.lastUsed,
    usageCount: keyInfo.usageCount,
    expiresAt: keyInfo.expiresAt,
    id: keyInfo._id
  }));
};

export const generateApiKey = () => {
  return 'key_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export default {
  authenticateCentralRepo,
  requirePermission,
  filterByInstitution,
  restrictToOwnInstitution,
  logApiAccess,
  addApiKey,
  revokeApiKey,
  listApiKeys,
  generateApiKey,
  PERMISSIONS
};
