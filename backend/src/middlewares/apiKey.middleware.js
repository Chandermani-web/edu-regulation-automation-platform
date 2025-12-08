import crypto from 'crypto';

/**
 * API Key Authentication Middleware
 * Protects central repository endpoints from unauthorized access
 */

// In production, store these in a database or environment variables
// For now, we'll use a simple in-memory store
const validApiKeys = new Map([
  // Example API keys (these should be generated and managed securely)
  ['test_key_12345', { service: 'Test Service', permissions: ['read'] }],
  ['admin_key_67890', { service: 'Admin Service', permissions: ['read', 'write'] }]
]);

/**
 * Generate a new API key
 */
export const generateApiKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Validate API key from request header
 */
export const validateApiKey = (req, res, next) => {
  const apiKey = req.header('X-API-Key') || req.query.apiKey;
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: 'API key is required. Please provide X-API-Key header or apiKey query parameter.'
    });
  }
  
  const keyInfo = validApiKeys.get(apiKey);
  
  if (!keyInfo) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired API key'
    });
  }
  
  // Attach key info to request for logging/tracking
  req.apiKeyInfo = keyInfo;
  
  next();
};

/**
 * Check if API key has specific permission
 */
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.apiKeyInfo) {
      return res.status(403).json({
        success: false,
        message: 'API key validation required'
      });
    }
    
    if (!req.apiKeyInfo.permissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        message: `Permission '${permission}' required for this operation`
      });
    }
    
    next();
  };
};

/**
 * Optional API key validation - allows requests with or without key
 */
export const optionalApiKey = (req, res, next) => {
  const apiKey = req.header('X-API-Key') || req.query.apiKey;
  
  if (apiKey) {
    const keyInfo = validApiKeys.get(apiKey);
    if (keyInfo) {
      req.apiKeyInfo = keyInfo;
    }
  }
  
  next();
};

/**
 * Add new API key (for admin use)
 */
export const addApiKey = (key, service, permissions = ['read']) => {
  validApiKeys.set(key, { service, permissions });
  return { key, service, permissions };
};

/**
 * Revoke API key
 */
export const revokeApiKey = (key) => {
  return validApiKeys.delete(key);
};

/**
 * List all API keys (admin only)
 */
export const listApiKeys = () => {
  return Array.from(validApiKeys.entries()).map(([key, info]) => ({
    key: key.substring(0, 8) + '...',
    service: info.service,
    permissions: info.permissions
  }));
};

export default {
  validateApiKey,
  requirePermission,
  optionalApiKey,
  generateApiKey,
  addApiKey,
  revokeApiKey,
  listApiKeys
};
