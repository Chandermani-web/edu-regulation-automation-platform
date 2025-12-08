import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Edit, Trash2, Eye, Building2 } from 'lucide-react';

const SuperAdminInstitutionManagement = () => {
  const [institutions, setInstitutions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [formData, setFormData] = useState({
    user_id: '',
    name: '',
    email: '',
    type: 'college',
    established_year: '',
    institution_code: '',
    phone: '',
    state: '',
    district: '',
    pincode: '',
    full_address: '',
    total_faculty: '',
    total_students: '',
    NAAC_grade: '',
    NIRF_rank: '',
    AISHE_code: '',
    UDISE_code: '',
    website: ''
  });

  useEffect(() => {
    fetchInstitutions();
    fetchInstitutionUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter, searchTerm]);

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/super-admin/institutions', {
        params: { type: typeFilter, search: searchTerm },
        withCredentials: true
      });
      setInstitutions(response.data.data);
    } catch (error) {
      console.error('Error fetching institutions:', error);
      alert('Failed to fetch institutions');
    } finally {
      setLoading(false);
    }
  };

  const fetchInstitutionUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/super-admin/users', {
        params: { role: 'institution' },
        withCredentials: true
      });
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCreateInstitution = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/super-admin/institutions', formData, {
        withCredentials: true
      });
      alert('Institution created successfully');
      setShowModal(false);
      resetForm();
      fetchInstitutions();
    } catch (error) {
      console.error('Error creating institution:', error);
      alert(error.response?.data?.message || 'Failed to create institution');
    }
  };

  const handleUpdateInstitution = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/super-admin/institutions/${selectedInstitution._id}`, formData, {
        withCredentials: true
      });
      alert('Institution updated successfully');
      setShowModal(false);
      resetForm();
      fetchInstitutions();
    } catch (error) {
      console.error('Error updating institution:', error);
      alert(error.response?.data?.message || 'Failed to update institution');
    }
  };

  const handleDeleteInstitution = async (institutionId) => {
    if (!window.confirm('Are you sure? This will delete the institution and all related data.')) {
      return;
    }
    try {
      await axios.delete(`http://localhost:3000/api/super-admin/institutions/${institutionId}`, {
        withCredentials: true
      });
      alert('Institution deleted successfully');
      fetchInstitutions();
    } catch (error) {
      console.error('Error deleting institution:', error);
      alert(error.response?.data?.message || 'Failed to delete institution');
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (institution) => {
    setModalMode('edit');
    setSelectedInstitution(institution);
    setFormData({
      user_id: institution.user_id?._id || '',
      name: institution.name,
      email: institution.email,
      type: institution.type,
      established_year: institution.established_year || '',
      institution_code: institution.institution_code || '',
      phone: institution.phone || '',
      state: institution.state || '',
      district: institution.district || '',
      pincode: institution.pincode || '',
      full_address: institution.full_address || '',
      total_faculty: institution.total_faculty || '',
      total_students: institution.total_students || '',
      NAAC_grade: institution.NAAC_grade || '',
      NIRF_rank: institution.NIRF_rank || '',
      AISHE_code: institution.AISHE_code || '',
      UDISE_code: institution.UDISE_code || '',
      website: institution.website || ''
    });
    setShowModal(true);
  };

  const openViewModal = async (institution) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/super-admin/institutions/${institution._id}`, {
        withCredentials: true
      });
      setSelectedInstitution(response.data.data);
      setModalMode('view');
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching institution details:', error);
      alert('Failed to fetch institution details');
    }
  };

  const resetForm = () => {
    setFormData({
      user_id: '',
      name: '',
      email: '',
      type: 'college',
      established_year: '',
      institution_code: '',
      phone: '',
      state: '',
      district: '',
      pincode: '',
      full_address: '',
      total_faculty: '',
      total_students: '',
      NAAC_grade: '',
      NIRF_rank: '',
      AISHE_code: '',
      UDISE_code: '',
      website: ''
    });
    setSelectedInstitution(null);
  };

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'university': return 'bg-purple-100 text-purple-800';
      case 'college': return 'bg-blue-100 text-blue-800';
      case 'institute': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Institution Management</h1>
          <p className="text-gray-600 mt-2">Manage all institutions in the system</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 flex-1 w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, email, or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="university">University</option>
                <option value="college">College</option>
                <option value="institute">Institute</option>
              </select>
            </div>

            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} />
              Create Institution
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading institutions...</p>
            </div>
          ) : institutions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Building2 size={48} className="mx-auto mb-4 text-gray-400" />
              <p>No institutions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">State</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIRF Rank</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {institutions.map((institution) => (
                    <tr key={institution._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{institution.name}</div>
                        <div className="text-sm text-gray-500">{institution.institution_code || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getTypeBadgeColor(institution.type)}`}>
                          {institution.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{institution.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{institution.state || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{institution.NIRF_rank || 'N/A'}</td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <button onClick={() => openViewModal(institution)} className="text-blue-600 hover:text-blue-900 mr-3" title="View">
                          <Eye size={18} />
                        </button>
                        <button onClick={() => openEditModal(institution)} className="text-green-600 hover:text-green-900 mr-3" title="Edit">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDeleteInstitution(institution._id)} className="text-red-600 hover:text-red-900" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {modalMode === 'create' && 'Create New Institution'}
              {modalMode === 'edit' && 'Edit Institution'}
              {modalMode === 'view' && 'Institution Details'}
            </h2>

            {modalMode === 'view' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-gray-900">{selectedInstitution?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Type</label>
                  <p className="mt-1">
                    <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getTypeBadgeColor(selectedInstitution?.type)}`}>
                      {selectedInstitution?.type.toUpperCase()}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-gray-900">{selectedInstitution?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-gray-900">{selectedInstitution?.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Institution Code</label>
                  <p className="mt-1 text-gray-900">{selectedInstitution?.institution_code || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Established Year</label>
                  <p className="mt-1 text-gray-900">{selectedInstitution?.established_year || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">State</label>
                  <p className="mt-1 text-gray-900">{selectedInstitution?.state || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">District</label>
                  <p className="mt-1 text-gray-900">{selectedInstitution?.district || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">NIRF Rank</label>
                  <p className="mt-1 text-gray-900">{selectedInstitution?.NIRF_rank || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">NAAC Grade</label>
                  <p className="mt-1 text-gray-900">{selectedInstitution?.NAAC_grade || 'N/A'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Website</label>
                  <p className="mt-1 text-blue-600">
                    <a href={selectedInstitution?.website} target="_blank" rel="noopener noreferrer">
                      {selectedInstitution?.website || 'N/A'}
                    </a>
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Full Address</label>
                  <p className="mt-1 text-gray-900">{selectedInstitution?.full_address || 'N/A'}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="md:col-span-2 mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={modalMode === 'create' ? handleCreateInstitution : handleUpdateInstitution}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User *</label>
                    <select
                      value={formData.user_id}
                      onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select User</option>
                      {users.map(user => (
                        <option key={user._id} value={user._id}>{user.email}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="college">College</option>
                      <option value="university">University</option>
                      <option value="institute">Institute</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Institution Code</label>
                    <input
                      type="text"
                      value={formData.institution_code}
                      onChange={(e) => setFormData({ ...formData, institution_code: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
                    <input
                      type="number"
                      value={formData.established_year}
                      onChange={(e) => setFormData({ ...formData, established_year: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">NIRF Rank</label>
                    <input
                      type="text"
                      value={formData.NIRF_rank}
                      onChange={(e) => setFormData({ ...formData, NIRF_rank: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">NAAC Grade</label>
                    <input
                      type="text"
                      value={formData.NAAC_grade}
                      onChange={(e) => setFormData({ ...formData, NAAC_grade: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Faculty</label>
                    <input
                      type="number"
                      value={formData.total_faculty}
                      onChange={(e) => setFormData({ ...formData, total_faculty: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Students</label>
                    <input
                      type="number"
                      value={formData.total_students}
                      onChange={(e) => setFormData({ ...formData, total_students: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                    <textarea
                      value={formData.full_address}
                      onChange={(e) => setFormData({ ...formData, full_address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                    {modalMode === 'create' ? 'Create' : 'Update'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminInstitutionManagement;
