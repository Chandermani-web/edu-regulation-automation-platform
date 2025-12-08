import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Key, Plus, Trash2, Shield, Eye, EyeOff, Copy, Check, AlertCircle, Info, X } from 'lucide-react';

const APIKeyManagement = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showApiDocsModal, setShowApiDocsModal] = useState(false);
  const [selectedKeyForDocs, setSelectedKeyForDocs] = useState(null);
  const [newKeyData, setNewKeyData] = useState(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedEndpoint, setCopiedEndpoint] = useState('');
  const [formData, setFormData] = useState({
    service: '',
    role: 'external_service'
  });
  const [visibleKeys, setVisibleKeys] = useState({});

  useEffect(() => {
    fetchApiKeys();
    fetchRoles();
  }, []);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/super-admin/api-keys', {
        withCredentials: true
      });
      setApiKeys(response.data.data || []);
    } catch (error) {
      console.error('Error fetching API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/super-admin/api-keys/roles', {
        withCredentials: true
      });
      setRoles(response.data.data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleGenerateKey = async () => {
    if (!formData.service || !formData.role) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:3000/api/super-admin/api-keys/generate',
        formData,
        { withCredentials: true }
      );
      
      setNewKeyData(response.data.data);
      setShowModal(true);
      setFormData({ service: '', role: 'external_service' });
      fetchApiKeys();
    } catch (error) {
      console.error('Error generating API key:', error);
      alert('Error generating API key: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeKey = async (key) => {
    if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(
        'http://localhost:3000/api/super-admin/api-keys/revoke',
        {
          data: { key },
          withCredentials: true
        }
      );
      alert('API key revoked successfully');
      fetchApiKeys();
    } catch (error) {
      console.error('Error revoking API key:', error);
      alert('Error revoking API key: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const copyEndpointToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(text);
    setTimeout(() => setCopiedEndpoint(''), 2000);
  };

  const toggleKeyVisibility = (index) => {
    setVisibleKeys(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      'super_admin': 'bg-red-100 text-red-800',
      'aicte_admin': 'bg-blue-100 text-blue-800',
      'ugc_admin': 'bg-purple-100 text-purple-800',
      'external_service': 'bg-green-100 text-green-800',
      'institution': 'bg-yellow-100 text-yellow-800',
      'public': 'bg-gray-100 text-gray-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const openApiDocsWithKey = (keyInfo) => {
    setSelectedKeyForDocs(keyInfo);
    setShowApiDocsModal(true);
  };

  const hasPermission = (permission) => {
    if (!selectedKeyForDocs) return true; // Show all if no key selected
    return selectedKeyForDocs.permissions[permission] === true;
  };

  const getApiKey = () => {
    return selectedKeyForDocs ? (selectedKeyForDocs.fullKey || selectedKeyForDocs.key) : '${getApiKey()}';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Key className="text-indigo-600" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">API Key Management</h1>
                <p className="text-gray-600">Manage access to Central Repository APIs</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowApiDocsModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                title="View API Documentation"
              >
                <Info size={20} />
                <span className="font-semibold">API Docs</span>
              </button>
              <Shield className="text-green-600" size={24} />
              <span className="text-sm font-semibold text-green-600">Secure Access</span>
            </div>
          </div>
        </div>

        {/* Generate New Key Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Plus className="text-blue-600" size={24} />
            Generate New API Key
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name *
              </label>
              <input
                type="text"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                placeholder="e.g., Government Portal"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="external_service">External Service</option>
                <option value="institution">Institution</option>
                <option value="public">Public (Read-only)</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleGenerateKey}
                disabled={loading || !formData.service}
                className="w-full px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Generate Key
              </button>
            </div>
          </div>
        </div>

        {/* Available Roles Info */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Role Permissions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((roleInfo) => (
              <div key={roleInfo.role} className="bg-white rounded-lg p-4 border border-gray-200">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${getRoleBadgeColor(roleInfo.role)}`}>
                  {roleInfo.role.replace('_', ' ').toUpperCase()}
                </span>
                <p className="text-sm text-gray-600 mb-3">{roleInfo.description}</p>
                <div className="space-y-1">
                  {Object.entries(roleInfo.permissions)
                    .filter(([, value]) => value === true)
                    .map(([permission]) => (
                      <div key={permission} className="flex items-center gap-2 text-xs text-gray-600">
                        <Check size={14} className="text-green-600" />
                        <span>{permission.replace('can', '').replace(/([A-Z])/g, ' $1').trim()}</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Keys List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Active API Keys ({apiKeys.length})</h2>
          
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading API keys...</p>
            </div>
          )}

          {!loading && apiKeys.length === 0 && (
            <div className="text-center py-12">
              <Key className="mx-auto text-gray-400 mb-4" size={64} />
              <p className="text-gray-600 text-lg">No API keys generated yet</p>
              <p className="text-sm text-gray-500 mt-2">Generate your first API key to get started</p>
            </div>
          )}

          {!loading && apiKeys.length > 0 && (
            <div className="space-y-4">
              {apiKeys.map((keyInfo, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{keyInfo.service}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(keyInfo.role)}`}>
                          {keyInfo.role.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-gray-100 px-3 py-1 rounded font-mono">
                          {visibleKeys[index] ? keyInfo.key.replace('...', '') : keyInfo.key}
                        </code>
                        <button
                          onClick={() => toggleKeyVisibility(index)}
                          className="p-1 hover:bg-gray-200 rounded"
                          title={visibleKeys[index] ? 'Hide key' : 'Show key'}
                        >
                          {visibleKeys[index] ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {Object.entries(keyInfo.permissions)
                          .filter(([, value]) => value === true)
                          .slice(0, 5)
                          .map(([permission]) => (
                            <span key={permission} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                              {permission.replace('can', '').replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                          ))}
                      </div>
                      <div className="mt-3">
                        <button
                          onClick={() => openApiDocsWithKey(keyInfo)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Info size={16} />
                          View API Documentation
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRevokeKey(keyInfo.fullKey)}
                      className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Revoke this API key"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* New Key Modal */}
        {showModal && newKeyData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-100 rounded-full">
                  <Check className="text-green-600" size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">API Key Generated Successfully!</h2>
                  <p className="text-gray-600">Save this key securely - it won't be shown again</p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-2">
                  <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
                  <div className="text-sm text-yellow-800">
                    <strong>Important:</strong> Copy and store this API key in a secure location. 
                    You won't be able to see the full key again after closing this window.
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
                  <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900 font-medium">
                    {newKeyData.service}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getRoleBadgeColor(newKeyData.role)}`}>
                    {newKeyData.role.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                  <div className="flex gap-2">
                    <code className="flex-1 px-4 py-3 bg-gray-900 text-green-400 rounded-lg font-mono text-sm break-all">
                      {newKeyData.key}
                    </code>
                    <button
                      onClick={() => copyToClipboard(newKeyData.key)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      {copiedKey ? <Check size={20} /> : <Copy size={20} />}
                      {copiedKey ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Usage Example</label>
                  <code className="block px-4 py-3 bg-gray-900 text-gray-300 rounded-lg font-mono text-xs overflow-x-auto">
                    curl -H "X-API-Key: {newKeyData.key}" \<br/>
                    &nbsp;&nbsp;http://localhost:3000/api/central-repository/institutions
                  </code>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowModal(false);
                  setNewKeyData(null);
                }}
                className="w-full px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800"
              >
                I've Saved the Key Securely
              </button>
            </div>
          </div>
        )}

        {/* API Documentation Modal */}
        {showApiDocsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full my-8 max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Info className="text-blue-600" size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Central Repository API Documentation</h2>
                    {selectedKeyForDocs ? (
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-gray-600">API Key: <span className="font-semibold">{selectedKeyForDocs.service}</span></p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getRoleBadgeColor(selectedKeyForDocs.role)}`}>
                          {selectedKeyForDocs.role.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    ) : (
                      <p className="text-gray-600">Complete API reference with examples</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowApiDocsModal(false);
                    setSelectedKeyForDocs(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Selected API Key Info */}
                {selectedKeyForDocs && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                          <Key size={18} />
                          Your API Key
                        </h3>
                        <div className="flex items-center gap-2">
                          <code className="px-3 py-2 bg-white border border-blue-200 rounded font-mono text-sm text-gray-900">
                            {selectedKeyForDocs.fullKey || selectedKeyForDocs.key}
                          </code>
                          <button
                            onClick={() => copyEndpointToClipboard(selectedKeyForDocs.fullKey || selectedKeyForDocs.key)}
                            className="p-2 bg-white hover:bg-blue-100 rounded border border-blue-200 transition-colors"
                            title="Copy API key"
                          >
                            {copiedEndpoint === (selectedKeyForDocs.fullKey || selectedKeyForDocs.key) ? 
                              <Check size={16} className="text-green-600" /> : 
                              <Copy size={16} className="text-blue-600" />
                            }
                          </button>
                        </div>
                        <p className="text-sm text-blue-700 mt-2">
                          All examples below use this API key. Ready to copy and use!
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Base URL */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Base URL</h3>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-gray-900 text-green-400 rounded font-mono text-sm">
                      http://localhost:3000/api/central-repository
                    </code>
                    <button
                      onClick={() => copyEndpointToClipboard('http://localhost:3000/api/central-repository')}
                      className="p-2 hover:bg-gray-200 rounded transition-colors"
                      title="Copy base URL"
                    >
                      {copiedEndpoint === 'http://localhost:3000/api/central-repository' ? 
                        <Check size={18} className="text-green-600" /> : 
                        <Copy size={18} />
                      }
                    </button>
                  </div>
                </div>

                {/* Authentication */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Shield size={20} className="text-blue-600" />
                    Authentication Methods
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded font-semibold text-xs">JWT</span>
                      <code className="text-gray-700">Authorization: Bearer {'<token>'}</code>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded font-semibold text-xs">API Key</span>
                      <code className="text-gray-700">X-API-Key: {'<${getApiKey()}>'}</code>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded font-semibold text-xs">Public</span>
                      <code className="text-gray-700">No authentication (limited access)</code>
                    </div>
                  </div>
                </div>

                {/* API Endpoints */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">API Endpoints</h3>

                  {/* 1. Get All Institutions */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-green-600 text-white rounded font-bold text-sm">GET</span>
                        <code className="text-gray-900 font-semibold">/institutions</code>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Get list of all institutions with pagination</p>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Query Parameters</h4>
                        <div className="text-sm space-y-1">
                          <div><code className="text-blue-600">page</code> - Page number (default: 1)</div>
                          <div><code className="text-blue-600">limit</code> - Items per page (default: 10)</div>
                          <div><code className="text-blue-600">type</code> - Filter by type (university/college/institute)</div>
                          <div><code className="text-blue-600">state</code> - Filter by state</div>
                          <div><code className="text-blue-600">search</code> - Search by name</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Example Requests</h4>
                        <div className="space-y-2">
                          {/* Basic request */}
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Basic pagination:</p>
                            <div className="flex items-start gap-2">
                              <code className="flex-1 px-3 py-2 bg-gray-900 text-green-400 rounded font-mono text-xs overflow-x-auto whitespace-pre">
{`curl -H "X-API-Key: ${getApiKey()}" \\
  "http://localhost:3000/api/central-repository/institutions?page=1&limit=20"`}
                              </code>
                              <button
                                onClick={() => copyEndpointToClipboard(`curl -H "X-API-Key: ${getApiKey()}" "http://localhost:3000/api/central-repository/institutions?page=1&limit=20"`)}
                                className="p-2 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                              >
                                {copiedEndpoint === `curl -H "X-API-Key: ${getApiKey()}" "http://localhost:3000/api/central-repository/institutions?page=1&limit=20"` ? 
                                  <Check size={16} className="text-green-600" /> : 
                                  <Copy size={16} />
                                }
                              </button>
                            </div>
                          </div>
                          {/* Filter by type */}
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Filter by type:</p>
                            <div className="flex items-start gap-2">
                              <code className="flex-1 px-3 py-2 bg-gray-900 text-green-400 rounded font-mono text-xs overflow-x-auto whitespace-pre">
{`curl -H "X-API-Key: ${getApiKey()}" \\
  "http://localhost:3000/api/central-repository/institutions?type=university&limit=50"`}
                              </code>
                              <button
                                onClick={() => copyEndpointToClipboard(`curl -H "X-API-Key: ${getApiKey()}" "http://localhost:3000/api/central-repository/institutions?type=university&limit=50"`)}
                                className="p-2 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                              >
                                {copiedEndpoint === `curl -H "X-API-Key: ${getApiKey()}" "http://localhost:3000/api/central-repository/institutions?type=university&limit=50"` ? 
                                  <Check size={16} className="text-green-600" /> : 
                                  <Copy size={16} />
                                }
                              </button>
                            </div>
                          </div>
                          {/* Search by name */}
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Search by name:</p>
                            <div className="flex items-start gap-2">
                              <code className="flex-1 px-3 py-2 bg-gray-900 text-green-400 rounded font-mono text-xs overflow-x-auto whitespace-pre">
{`curl -H "X-API-Key: ${getApiKey()}" \\
  "http://localhost:3000/api/central-repository/institutions?search=IIT&state=Delhi"`}
                              </code>
                              <button
                                onClick={() => copyEndpointToClipboard(`curl -H "X-API-Key: ${getApiKey()}" "http://localhost:3000/api/central-repository/institutions?search=IIT&state=Delhi"`)}
                                className="p-2 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                              >
                                {copiedEndpoint === `curl -H "X-API-Key: ${getApiKey()}" "http://localhost:3000/api/central-repository/institutions?search=IIT&state=Delhi"` ? 
                                  <Check size={16} className="text-green-600" /> : 
                                  <Copy size={16} />
                                }
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Get Institution Details */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-green-600 text-white rounded font-bold text-sm">GET</span>
                        <code className="text-gray-900 font-semibold">/institutions/:id</code>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Get detailed information about a specific institution</p>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Query Parameters</h4>
                        <div className="text-sm space-y-1">
                          <div><code className="text-blue-600">includeParameters</code> - Include parameters (true/false)</div>
                          <div><code className="text-blue-600">includeApplications</code> - Include applications (true/false)</div>
                          <div><code className="text-blue-600">includeAIData</code> - Include AI analysis (true/false)</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Example Requests</h4>
                        <div className="space-y-2">
                          {/* With all parameters */}
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Get full details with parameters and AI data:</p>
                            <div className="flex items-start gap-2">
                              <code className="flex-1 px-3 py-2 bg-gray-900 text-green-400 rounded font-mono text-xs overflow-x-auto whitespace-pre">
{`curl -H "X-API-Key: ${getApiKey()}" \\
  "http://localhost:3000/api/central-repository/institutions/507f1f77bcf86cd799439011?includeParameters=true&includeApplications=true&includeAIData=true"`}
                              </code>
                              <button
                                onClick={() => copyEndpointToClipboard(`curl -H "X-API-Key: ${getApiKey()}" "http://localhost:3000/api/central-repository/institutions/507f1f77bcf86cd799439011?includeParameters=true&includeApplications=true&includeAIData=true"`)}
                                className="p-2 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                              >
                                {copiedEndpoint.includes('507f1f77bcf86cd799439011?include') ? 
                                  <Check size={16} className="text-green-600" /> : 
                                  <Copy size={16} />
                                }
                              </button>
                            </div>
                          </div>
                          {/* Basic info only */}
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Get basic institution info only:</p>
                            <div className="flex items-start gap-2">
                              <code className="flex-1 px-3 py-2 bg-gray-900 text-green-400 rounded font-mono text-xs overflow-x-auto whitespace-pre">
{`curl -H "X-API-Key: ${getApiKey()}" \\
  "http://localhost:3000/api/central-repository/institutions/507f1f77bcf86cd799439011"`}
                              </code>
                              <button
                                onClick={() => copyEndpointToClipboard(`curl -H "X-API-Key: ${getApiKey()}" "http://localhost:3000/api/central-repository/institutions/507f1f77bcf86cd799439011"`)}
                                className="p-2 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                              >
                                {copiedEndpoint === `curl -H "X-API-Key: ${getApiKey()}" "http://localhost:3000/api/central-repository/institutions/507f1f77bcf86cd799439011"` ? 
                                  <Check size={16} className="text-green-600" /> : 
                                  <Copy size={16} />
                                }
                              </button>
                            </div>
                          </div>
                          {/* Only parameters */}
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Get institution with parameters only:</p>
                            <div className="flex items-start gap-2">
                              <code className="flex-1 px-3 py-2 bg-gray-900 text-green-400 rounded font-mono text-xs overflow-x-auto whitespace-pre">
{`curl -H "X-API-Key: ${getApiKey()}" \\
  "http://localhost:3000/api/central-repository/institutions/507f1f77bcf86cd799439011?includeParameters=true"`}
                              </code>
                              <button
                                onClick={() => copyEndpointToClipboard(`curl -H "X-API-Key: ${getApiKey()}" "http://localhost:3000/api/central-repository/institutions/507f1f77bcf86cd799439011?includeParameters=true"`)}
                                className="p-2 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                              >
                                {copiedEndpoint === `curl -H "X-API-Key: ${getApiKey()}" "http://localhost:3000/api/central-repository/institutions/507f1f77bcf86cd799439011?includeParameters=true"` ? 
                                  <Check size={16} className="text-green-600" /> : 
                                  <Copy size={16} />
                                }
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Get Application Status */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-green-600 text-white rounded font-bold text-sm">GET</span>
                        <code className="text-gray-900 font-semibold">/applications/status</code>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Get application status with AI analysis</p>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Query Parameters</h4>
                        <div className="text-sm space-y-1">
                          <div><code className="text-blue-600">institutionId</code> - Filter by institution ID</div>
                          <div><code className="text-blue-600">status</code> - Filter by status (pending/approved/rejected)</div>
                          <div><code className="text-blue-600">page</code> - Page number</div>
                          <div><code className="text-blue-600">limit</code> - Items per page</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Example Requests</h4>
                        <div className="space-y-2">
                          {/* All pending applications */}
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Get all pending applications:</p>
                            <div className="flex items-start gap-2">
                              <code className="flex-1 px-3 py-2 bg-gray-900 text-green-400 rounded font-mono text-xs overflow-x-auto whitespace-pre">
{`curl -H "X-API-Key: ${getApiKey()}" \\
  "http://localhost:3000/api/central-repository/applications/status?status=pending&page=1&limit=50"`}
                              </code>
                              <button
                                onClick={() => copyEndpointToClipboard(`curl -H "X-API-Key: ${getApiKey()}" "http://localhost:3000/api/central-repository/applications/status?status=pending&page=1&limit=50"`)}
                                className="p-2 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                              >
                                {copiedEndpoint === `curl -H "X-API-Key: ${getApiKey()}" "http://localhost:3000/api/central-repository/applications/status?status=pending&page=1&limit=50"` ? 
                                  <Check size={16} className="text-green-600" /> : 
                                  <Copy size={16} />
                                }
                              </button>
                            </div>
                          </div>
                          {/* Specific institution applications */}
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Get applications for specific institution:</p>
                            <div className="flex items-start gap-2">
                              <code className="flex-1 px-3 py-2 bg-gray-900 text-green-400 rounded font-mono text-xs overflow-x-auto whitespace-pre">
{`curl -H "X-API-Key: ${getApiKey()}" \\
  "http://localhost:3000/api/central-repository/applications/status?institutionId=507f1f77bcf86cd799439011"`}
                              </code>
                              <button
                                onClick={() => copyEndpointToClipboard(`curl -H "X-API-Key: ${getApiKey()}" "http://localhost:3000/api/central-repository/applications/status?institutionId=507f1f77bcf86cd799439011"`)}
                                className="p-2 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                              >
                                {copiedEndpoint === `curl -H "X-API-Key: ${getApiKey()}" "http://localhost:3000/api/central-repository/applications/status?institutionId=507f1f77bcf86cd799439011"` ? 
                                  <Check size={16} className="text-green-600" /> : 
                                  <Copy size={16} />
                                }
                              </button>
                            </div>
                          </div>
                          {/* Approved applications */}
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Get all approved applications:</p>
                            <div className="flex items-start gap-2">
                              <code className="flex-1 px-3 py-2 bg-gray-900 text-green-400 rounded font-mono text-xs overflow-x-auto whitespace-pre">
{`curl -H "X-API-Key: ${getApiKey()}" \\
  "http://localhost:3000/api/central-repository/applications/status?status=approved"`}
                              </code>
                              <button
                                onClick={() => copyEndpointToClipboard(`curl -H "X-API-Key: ${getApiKey()}" "http://localhost:3000/api/central-repository/applications/status?status=approved"`)}
                                className="p-2 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                              >
                                {copiedEndpoint === `curl -H "X-API-Key: ${getApiKey()}" "http://localhost:3000/api/central-repository/applications/status?status=approved"` ? 
                                  <Check size={16} className="text-green-600" /> : 
                                  <Copy size={16} />
                                }
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4. Query by Parameters */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-yellow-600 text-white rounded font-bold text-sm">POST</span>
                        <code className="text-gray-900 font-semibold">/institutions/query</code>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Query institutions by parameter values</p>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Request Body</h4>
                        <code className="block px-3 py-2 bg-gray-900 text-green-400 rounded font-mono text-xs overflow-x-auto whitespace-pre">
{`{
  "parameters": [
    {
      "parameterName": "Faculty Count",
      "value": "100",
      "condition": "greaterThan"
    }
  ],
  "operator": "AND"
}`}
                        </code>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Example Requests</h4>
                        <div className="space-y-2">
                          {/* Query by numeric comparison */}
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Find institutions with faculty count greater than 100:</p>
                            <div className="flex items-start gap-2">
                              <code className="flex-1 px-3 py-2 bg-gray-900 text-green-400 rounded font-mono text-xs overflow-x-auto whitespace-pre">
{`curl -X POST -H "X-API-Key: ${getApiKey()}" \\
  -H "Content-Type: application/json" \\
  -d '{"parameters":[{"parameterName":"Faculty Count","value":"100","condition":"greaterThan"}],"operator":"AND"}' \\
  "http://localhost:3000/api/central-repository/institutions/query"`}
                              </code>
                              <button
                                onClick={() => copyEndpointToClipboard(`curl -X POST -H "X-API-Key: ${getApiKey()}" -H "Content-Type: application/json" -d '{"parameters":[{"parameterName":"Faculty Count","value":"100","condition":"greaterThan"}],"operator":"AND"}' "http://localhost:3000/api/central-repository/institutions/query"`)}
                                className="p-2 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                              >
                                {copiedEndpoint.includes('Faculty Count') ? 
                                  <Check size={16} className="text-green-600" /> : 
                                  <Copy size={16} />
                                }
                              </button>
                            </div>
                          </div>
                          {/* Query by exact match */}
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Find institutions with specific accreditation:</p>
                            <div className="flex items-start gap-2">
                              <code className="flex-1 px-3 py-2 bg-gray-900 text-green-400 rounded font-mono text-xs overflow-x-auto whitespace-pre">
{`curl -X POST -H "X-API-Key: ${getApiKey()}" \\
  -H "Content-Type: application/json" \\
  -d '{"parameters":[{"parameterName":"Accreditation","value":"NAAC A+","condition":"equals"}],"operator":"AND"}' \\
  "http://localhost:3000/api/central-repository/institutions/query"`}
                              </code>
                              <button
                                onClick={() => copyEndpointToClipboard(`curl -X POST -H "X-API-Key: ${getApiKey()}" -H "Content-Type: application/json" -d '{"parameters":[{"parameterName":"Accreditation","value":"NAAC A+","condition":"equals"}],"operator":"AND"}' "http://localhost:3000/api/central-repository/institutions/query"`)}
                                className="p-2 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                              >
                                {copiedEndpoint.includes('Accreditation') ? 
                                  <Check size={16} className="text-green-600" /> : 
                                  <Copy size={16} />
                                }
                              </button>
                            </div>
                          </div>
                          {/* Multiple conditions with OR */}
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Find institutions matching any of multiple criteria:</p>
                            <div className="flex items-start gap-2">
                              <code className="flex-1 px-3 py-2 bg-gray-900 text-green-400 rounded font-mono text-xs overflow-x-auto whitespace-pre">
{`curl -X POST -H "X-API-Key: ${getApiKey()}" \\
  -H "Content-Type: application/json" \\
  -d '{"parameters":[{"parameterName":"Library Size","value":"50000","condition":"greaterThan"},{"parameterName":"Lab Count","value":"20","condition":"greaterThan"}],"operator":"OR"}' \\
  "http://localhost:3000/api/central-repository/institutions/query"`}
                              </code>
                              <button
                                onClick={() => copyEndpointToClipboard(`curl -X POST -H "X-API-Key: ${getApiKey()}" -H "Content-Type: application/json" -d '{"parameters":[{"parameterName":"Library Size","value":"50000","condition":"greaterThan"},{"parameterName":"Lab Count","value":"20","condition":"greaterThan"}],"operator":"OR"}' "http://localhost:3000/api/central-repository/institutions/query"`)}
                                className="p-2 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                              >
                                {copiedEndpoint.includes('Library Size') ? 
                                  <Check size={16} className="text-green-600" /> : 
                                  <Copy size={16} />
                                }
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 5. Get Statistics */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-green-600 text-white rounded font-bold text-sm">GET</span>
                        <code className="text-gray-900 font-semibold">/statistics</code>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Get platform-wide or institution-specific statistics</p>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Query Parameters</h4>
                        <div className="text-sm">
                          <div><code className="text-blue-600">institutionId</code> - Filter for specific institution (optional)</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Example Requests</h4>
                        <div className="space-y-2">
                          {/* Overall statistics */}
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Get platform-wide statistics:</p>
                            <div className="flex items-start gap-2">
                              <code className="flex-1 px-3 py-2 bg-gray-900 text-green-400 rounded font-mono text-xs overflow-x-auto whitespace-pre">
{`curl -H "X-API-Key: ${getApiKey()}" \\
  "http://localhost:3000/api/central-repository/statistics"`}
                              </code>
                              <button
                                onClick={() => copyEndpointToClipboard(`curl -H "X-API-Key: ${getApiKey()}" "http://localhost:3000/api/central-repository/statistics"`)}
                                className="p-2 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                              >
                                {copiedEndpoint === `curl -H "X-API-Key: ${getApiKey()}" "http://localhost:3000/api/central-repository/statistics"` ? 
                                  <Check size={16} className="text-green-600" /> : 
                                  <Copy size={16} />
                                }
                              </button>
                            </div>
                          </div>
                          {/* Institution-specific statistics */}
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Get statistics for specific institution:</p>
                            <div className="flex items-start gap-2">
                              <code className="flex-1 px-3 py-2 bg-gray-900 text-green-400 rounded font-mono text-xs overflow-x-auto whitespace-pre">
{`curl -H "X-API-Key: ${getApiKey()}" \\
  "http://localhost:3000/api/central-repository/statistics?institutionId=507f1f77bcf86cd799439011"`}
                              </code>
                              <button
                                onClick={() => copyEndpointToClipboard(`curl -H "X-API-Key: ${getApiKey()}" "http://localhost:3000/api/central-repository/statistics?institutionId=507f1f77bcf86cd799439011"`)}
                                className="p-2 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                              >
                                {copiedEndpoint === `curl -H "X-API-Key: ${getApiKey()}" "http://localhost:3000/api/central-repository/statistics?institutionId=507f1f77bcf86cd799439011"` ? 
                                  <Check size={16} className="text-green-600" /> : 
                                  <Copy size={16} />
                                }
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 6. Bulk Query */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-yellow-600 text-white rounded font-bold text-sm">POST</span>
                        <code className="text-gray-900 font-semibold">/institutions/bulk</code>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Fetch multiple institutions in one request</p>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Request Body</h4>
                        <code className="block px-3 py-2 bg-gray-900 text-green-400 rounded font-mono text-xs overflow-x-auto whitespace-pre">
{`{
  "institutionIds": [
    "507f1f77bcf86cd799439011",
    "507f1f77bcf86cd799439012"
  ],
  "fields": ["parameters", "applications", "aiData"]
}`}
                        </code>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Example Requests</h4>
                        <div className="space-y-2">
                          {/* Bulk with all fields */}
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Fetch multiple institutions with all data:</p>
                            <div className="flex items-start gap-2">
                              <code className="flex-1 px-3 py-2 bg-gray-900 text-green-400 rounded font-mono text-xs overflow-x-auto whitespace-pre">
{`curl -X POST -H "X-API-Key: ${getApiKey()}" \\
  -H "Content-Type: application/json" \\
  -d '{"institutionIds":["507f1f77bcf86cd799439011","507f1f77bcf86cd799439012"],"fields":["parameters","applications","aiData"]}' \\
  "http://localhost:3000/api/central-repository/institutions/bulk"`}
                              </code>
                              <button
                                onClick={() => copyEndpointToClipboard(`curl -X POST -H "X-API-Key: ${getApiKey()}" -H "Content-Type: application/json" -d '{"institutionIds":["507f1f77bcf86cd799439011","507f1f77bcf86cd799439012"],"fields":["parameters","applications","aiData"]}' "http://localhost:3000/api/central-repository/institutions/bulk"`)}
                                className="p-2 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                              >
                                {copiedEndpoint.includes('/bulk') && copiedEndpoint.includes('parameters') ? 
                                  <Check size={16} className="text-green-600" /> : 
                                  <Copy size={16} />
                                }
                              </button>
                            </div>
                          </div>
                          {/* Bulk parameters only */}
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Fetch only parameters for multiple institutions:</p>
                            <div className="flex items-start gap-2">
                              <code className="flex-1 px-3 py-2 bg-gray-900 text-green-400 rounded font-mono text-xs overflow-x-auto whitespace-pre">
{`curl -X POST -H "X-API-Key: ${getApiKey()}" \\
  -H "Content-Type: application/json" \\
  -d '{"institutionIds":["507f1f77bcf86cd799439011","507f1f77bcf86cd799439012","507f1f77bcf86cd799439013"],"fields":["parameters"]}' \\
  "http://localhost:3000/api/central-repository/institutions/bulk"`}
                              </code>
                              <button
                                onClick={() => copyEndpointToClipboard(`curl -X POST -H "X-API-Key: ${getApiKey()}" -H "Content-Type: application/json" -d '{"institutionIds":["507f1f77bcf86cd799439011","507f1f77bcf86cd799439012","507f1f77bcf86cd799439013"],"fields":["parameters"]}' "http://localhost:3000/api/central-repository/institutions/bulk"`)}
                                className="p-2 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                              >
                                {copiedEndpoint.includes('/bulk') && copiedEndpoint.includes('439013') ? 
                                  <Check size={16} className="text-green-600" /> : 
                                  <Copy size={16} />
                                }
                              </button>
                            </div>
                          </div>
                          {/* Bulk AI data only */}
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Fetch only AI analysis data:</p>
                            <div className="flex items-start gap-2">
                              <code className="flex-1 px-3 py-2 bg-gray-900 text-green-400 rounded font-mono text-xs overflow-x-auto whitespace-pre">
{`curl -X POST -H "X-API-Key: ${getApiKey()}" \\
  -H "Content-Type: application/json" \\
  -d '{"institutionIds":["507f1f77bcf86cd799439011","507f1f77bcf86cd799439012"],"fields":["aiData"]}' \\
  "http://localhost:3000/api/central-repository/institutions/bulk"`}
                              </code>
                              <button
                                onClick={() => copyEndpointToClipboard(`curl -X POST -H "X-API-Key: ${getApiKey()}" -H "Content-Type: application/json" -d '{"institutionIds":["507f1f77bcf86cd799439011","507f1f77bcf86cd799439012"],"fields":["aiData"]}' "http://localhost:3000/api/central-repository/institutions/bulk"`)}
                                className="p-2 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                              >
                                {copiedEndpoint.includes('/bulk') && copiedEndpoint.includes('aiData') && !copiedEndpoint.includes('parameters') ? 
                                  <Check size={16} className="text-green-600" /> : 
                                  <Copy size={16} />
                                }
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 7. Get Parameter Templates */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-green-600 text-white rounded font-bold text-sm">GET</span>
                        <code className="text-gray-900 font-semibold">/parameter-templates</code>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Get all available parameter templates</p>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Query Parameters</h4>
                        <div className="text-sm">
                          <div><code className="text-blue-600">category</code> - Filter by category (optional)</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Example Requests</h4>
                        <div className="space-y-2">
                          {/* All parameter templates */}
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Get all parameter templates:</p>
                            <div className="flex items-start gap-2">
                              <code className="flex-1 px-3 py-2 bg-gray-900 text-green-400 rounded font-mono text-xs overflow-x-auto whitespace-pre">
{`curl -H "X-API-Key: ${getApiKey()}" \\
  "http://localhost:3000/api/central-repository/parameter-templates"`}
                              </code>
                              <button
                                onClick={() => copyEndpointToClipboard(`curl -H "X-API-Key: ${getApiKey()}" "http://localhost:3000/api/central-repository/parameter-templates"`)}
                                className="p-2 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                              >
                                {copiedEndpoint === `curl -H "X-API-Key: ${getApiKey()}" "http://localhost:3000/api/central-repository/parameter-templates"` ? 
                                  <Check size={16} className="text-green-600" /> : 
                                  <Copy size={16} />
                                }
                              </button>
                            </div>
                          </div>
                          {/* Filter by category */}
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Get parameters for specific category:</p>
                            <div className="flex items-start gap-2">
                              <code className="flex-1 px-3 py-2 bg-gray-900 text-green-400 rounded font-mono text-xs overflow-x-auto whitespace-pre">
{`curl -H "X-API-Key: ${getApiKey()}" \\
  "http://localhost:3000/api/central-repository/parameter-templates?category=Infrastructure"`}
                              </code>
                              <button
                                onClick={() => copyEndpointToClipboard(`curl -H "X-API-Key: ${getApiKey()}" "http://localhost:3000/api/central-repository/parameter-templates?category=Infrastructure"`)}
                                className="p-2 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                              >
                                {copiedEndpoint === `curl -H "X-API-Key: ${getApiKey()}" "http://localhost:3000/api/central-repository/parameter-templates?category=Infrastructure"` ? 
                                  <Check size={16} className="text-green-600" /> : 
                                  <Copy size={16} />
                                }
                              </button>
                            </div>
                          </div>
                          {/* Academic category */}
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Get academic parameters:</p>
                            <div className="flex items-start gap-2">
                              <code className="flex-1 px-3 py-2 bg-gray-900 text-green-400 rounded font-mono text-xs overflow-x-auto whitespace-pre">
{`curl -H "X-API-Key: ${getApiKey()}" \\
  "http://localhost:3000/api/central-repository/parameter-templates?category=Academic"`}
                              </code>
                              <button
                                onClick={() => copyEndpointToClipboard(`curl -H "X-API-Key: ${getApiKey()}" "http://localhost:3000/api/central-repository/parameter-templates?category=Academic"`)}
                                className="p-2 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                              >
                                {copiedEndpoint === `curl -H "X-API-Key: ${getApiKey()}" "http://localhost:3000/api/central-repository/parameter-templates?category=Academic"` ? 
                                  <Check size={16} className="text-green-600" /> : 
                                  <Copy size={16} />
                                }
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <Info size={18} />
                    Quick Tips
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    {selectedKeyForDocs ? (
                      <>
                        <li>All examples use <strong>your actual API key</strong> - ready to copy and run!</li>
                        <li>Just replace sample institution IDs (507f1f77bcf86cd799439011) with real IDs from your database</li>
                        <li>Click any copy button to get the complete command with your API key included</li>
                        <li>Your role: <strong>{selectedKeyForDocs.role.replace('_', ' ').toUpperCase()}</strong> - only permitted endpoints are shown</li>
                      </>
                    ) : (
                      <>
                        <li>Click "View API Documentation" on any API key to see examples with that key</li>
                        <li>Replace sample institution IDs (507f1f77bcf86cd799439011) with actual IDs from your database</li>
                        <li>All cURL examples are ready to use once you select an API key</li>
                      </>
                    )}
                    <li>All responses follow the format: <code className="bg-blue-100 px-1 rounded">{`{success, message, data}`}</code></li>
                    <li>Use pagination parameters (page, limit) for large datasets</li>
                    <li>For detailed documentation, refer to CENTRAL_REPOSITORY_README.md in the project root</li>
                  </ul>
                </div>

                {/* Response Format Example */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-3">Standard Response Format</h3>
                  <code className="block px-3 py-2 bg-gray-900 text-green-400 rounded font-mono text-xs overflow-x-auto whitespace-pre">
{`// Success Response
{
  "success": true,
  "message": "Data fetched successfully",
  "data": { ... }
}

// Error Response
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error info"
}`}
                  </code>
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4">
                <button
                  onClick={() => setShowApiDocsModal(false)}
                  className="w-full px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Close Documentation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default APIKeyManagement;
