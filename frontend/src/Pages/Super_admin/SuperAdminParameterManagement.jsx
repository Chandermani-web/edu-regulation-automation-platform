import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Plus, Search, Edit, Trash2, Filter, Power, PowerOff, ChevronDown, ChevronUp } from 'lucide-react';

const SuperAdminParameterManagement = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCompactView, setIsCompactView] = useState(false);
  const [formData, setFormData] = useState({
    parameter_category: '',
    parameter_name: '',
    norm_value: '',
    authority: '',
    criticality: 'medium',
    description: ''
  });

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      const params = { search: searchTerm };
      if (categoryFilter) params.category = categoryFilter;
      if (statusFilter !== 'all') params.is_active = statusFilter === 'active';
      
      console.log('Fetching templates with params:', params);
      const response = await axios.get('http://localhost:3000/api/super-admin/parameter-templates', {
        params,
        withCredentials: true
      });
      console.log('Response:', response.data);
      setTemplates(response.data.data || []);
      
      // Extract unique categories
      const uniqueCategories = [...new Set((response.data.data || []).map(t => t.parameter_category))].filter(Boolean);
      setCategories(uniqueCategories.sort());
    } catch (error) {
      console.error('Error fetching parameter templates:', error);
      console.error('Error response:', error.response?.data);
      alert('Failed to fetch parameter templates: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, searchTerm, statusFilter]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/super-admin/parameter-templates', formData, {
        withCredentials: true
      });
      alert('Parameter template created successfully! This is now available to all institutions.');
      setShowModal(false);
      resetForm();
      fetchTemplates();
    } catch (error) {
      console.error('Error creating parameter template:', error);
      alert(error.response?.data?.message || 'Failed to create parameter template');
    }
  };

  const handleUpdateTemplate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/super-admin/parameter-templates/${selectedTemplate._id}`, formData, {
        withCredentials: true
      });
      alert('Parameter template updated successfully!');
      setShowModal(false);
      resetForm();
      fetchTemplates();
    } catch (error) {
      console.error('Error updating parameter template:', error);
      alert(error.response?.data?.message || 'Failed to update parameter template');
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    if (!window.confirm('Are you sure you want to delete this parameter template? This action cannot be undone if no institutions are using it.')) {
      return;
    }
    try {
      await axios.delete(`http://localhost:3000/api/super-admin/parameter-templates/${templateId}`, {
        withCredentials: true
      });
      alert('Parameter template deleted successfully');
      fetchTemplates();
    } catch (error) {
      console.error('Error deleting parameter template:', error);
      alert(error.response?.data?.message || 'Failed to delete parameter template');
    }
  };

  const handleToggleStatus = async (templateId) => {
    try {
      await axios.patch(`http://localhost:3000/api/super-admin/parameter-templates/${templateId}/toggle-status`, {}, {
        withCredentials: true
      });
      alert('Parameter template status updated!');
      fetchTemplates();
    } catch (error) {
      console.error('Error toggling template status:', error);
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (template) => {
    setModalMode('edit');
    setSelectedTemplate(template);
    setFormData({
      parameter_category: template.parameter_category,
      parameter_name: template.parameter_name,
      norm_value: template.norm_value,
      authority: template.authority || '',
      criticality: template.criticality || 'medium',
      description: template.description || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      parameter_category: '',
      parameter_name: '',
      norm_value: '',
      authority: '',
      criticality: 'medium',
      description: ''
    });
    setSelectedTemplate(null);
    setShowNewCategoryInput(false);
    setNewCategoryName('');
  };

  const handleAddNewCategory = () => {
    if (newCategoryName.trim()) {
      setFormData({ ...formData, parameter_category: newCategoryName.trim() });
      setCategories([...categories, newCategoryName.trim()].sort());
      setShowNewCategoryInput(false);
      setNewCategoryName('');
    }
  };

  const handleCategoryChange = (value) => {
    if (value === '__add_new__') {
      setShowNewCategoryInput(true);
      setFormData({ ...formData, parameter_category: '' });
    } else {
      setFormData({ ...formData, parameter_category: value });
      setShowNewCategoryInput(false);
    }
  };

  const getCriticalityColor = (criticality) => {
    switch (criticality?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const uniqueCategories = [...new Set(templates.map(p => p.parameter_category))].filter(Boolean);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Global Parameter Templates</h1>
          <p className="text-gray-600 mt-2">Define parameters that will be available to ALL institutions</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search parameter templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {uniqueCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsCompactView(!isCompactView)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                {isCompactView ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                {isCompactView ? 'Expand View' : 'Compact View'}
              </button>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus size={20} />
                Create Parameter Template
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading parameter templates...</p>
            </div>
          ) : templates.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Filter size={48} className="mx-auto mb-4 text-gray-400" />
              <p>No parameter templates found</p>
              <p className="text-sm mt-2">Create a template to make it available to all institutions</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {isCompactView ? (
                /* Compact View */
                <div className="space-y-2 p-4">
                  {templates.map((template) => (
                    <div
                      key={template._id}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                              {template.parameter_category}
                            </span>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCriticalityColor(template.criticality)}`}>
                              {template.criticality || 'medium'}
                            </span>
                            {template.is_active ? (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                Inactive
                              </span>
                            )}
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-1">{template.parameter_name}</h4>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Norm:</span> {template.norm_value}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            <span className="font-medium">Authority:</span> {template.authority}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleToggleStatus(template._id)}
                            className={`${template.is_active ? 'text-gray-600 hover:text-gray-900' : 'text-green-600 hover:text-green-900'} p-2`}
                            title={template.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {template.is_active ? <PowerOff size={18} /> : <Power size={18} />}
                          </button>
                          <button
                            onClick={() => openEditModal(template)}
                            className="text-blue-600 hover:text-blue-900 p-2"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteTemplate(template._id)}
                            className="text-red-600 hover:text-red-900 p-2"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Table View */
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parameter Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Norm Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Authority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Criticality</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {templates.map((template) => (
                    <tr key={template._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{template.parameter_category}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{template.parameter_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{template.norm_value}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{template.authority}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${getCriticalityColor(template.criticality)}`}>
                          {template.criticality || 'medium'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {template.is_active ? (
                          <span className="px-2 py-1 inline-flex text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 inline-flex text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <button
                          onClick={() => handleToggleStatus(template._id)}
                          className={`${template.is_active ? 'text-gray-600 hover:text-gray-900' : 'text-green-600 hover:text-green-900'} mr-3`}
                          title={template.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {template.is_active ? <PowerOff size={18} /> : <Power size={18} />}
                        </button>
                        <button
                          onClick={() => openEditModal(template)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">
              {modalMode === 'create' ? 'Create Parameter Template' : 'Edit Parameter Template'}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {modalMode === 'create' ? 'This template will be available to ALL institutions for parameter entry.' : 'Update this global parameter template.'}
            </p>

            <form onSubmit={modalMode === 'create' ? handleCreateTemplate : handleUpdateTemplate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  {!showNewCategoryInput ? (
                    <div className="space-y-2">
                      <select
                        value={formData.parameter_category}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required={!showNewCategoryInput}
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat, idx) => (
                          <option key={idx} value={cat}>
                            {cat}
                          </option>
                        ))}
                        <option value="__add_new__">+ Add New Category</option>
                      </select>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter new category name"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleAddNewCategory}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewCategoryInput(false);
                          setNewCategoryName('');
                        }}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parameter Name *</label>
                  <input
                    type="text"
                    value={formData.parameter_name}
                    onChange={(e) => setFormData({ ...formData, parameter_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Number of Classrooms"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Norm Value *</label>
                  <input
                    type="text"
                    value={formData.norm_value}
                    onChange={(e) => setFormData({ ...formData, norm_value: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 50, >100, etc."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Authority *</label>
                  <input
                    type="text"
                    value={formData.authority}
                    onChange={(e) => setFormData({ ...formData, authority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., AICTE, UGC"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Criticality</label>
                  <select
                    value={formData.criticality}
                    onChange={(e) => setFormData({ ...formData, criticality: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Additional details about this parameter..."
                    rows="3"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {modalMode === 'create' ? 'Create Template' : 'Update Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminParameterManagement;
