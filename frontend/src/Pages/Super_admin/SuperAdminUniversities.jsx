import React, { useContext, useEffect, useState } from 'react'
import SuperAdminLayout from '../../Components/SuperAdminLayout'
import { Building2, CheckCircle, AlertCircle, MapPin, Calendar, Globe, Mail, BookOpen, ChevronRight, X, Download, Check, XCircle, Award, TrendingUp } from 'lucide-react'
import AppContext from '../../Context/UseContext'

const SuperAdminUniversities = () => {
    const { allInstitutionDetails } = useContext(AppContext)
    const [filteredInstitutions, setFilteredInstitutions] = useState([])
    const [selectedInstitution, setSelectedInstitution] = useState(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        if (allInstitutionDetails) {
            const filtered = allInstitutionDetails.filter(inst => 
                inst.type === 'aicte' && 
                inst.applications?.some(app => app.approved_by === 'aicte' && app.isApproved === true)
            )
            setFilteredInstitutions(filtered)
        }
    }, [allInstitutionDetails])

    const handleInstitutionClick = (institution) => {
        setSelectedInstitution(institution)
        setSidebarOpen(true)
    }

    const closeSidebar = () => {
        setSidebarOpen(false)
        setSelectedInstitution(null)
    }

    const getComplianceStatus = (parameters) => {
        if (!parameters || parameters.length === 0) return { percentage: 0, compliant: 0, total: 0 }
        const compliantCount = parameters.filter(p => p.is_compliant === true).length
        const percentage = Math.round((compliantCount / parameters.length) * 100)
        return { percentage, compliant: compliantCount, total: parameters.length }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    return (
        <SuperAdminLayout>
            <div className="relative">
                {/* heading */}
                <div className='flex items-center justify-between mb-8'>
                    <div className='flex items-center gap-3'>
                        <div className='bg-gradient-to-br from-green-600 to-green-800 p-3 rounded-2xl shadow-lg'>
                            <Building2 size={20} className="text-white" />
                        </div>
                        <div className='tracking-wide'>
                            <h1 className="text-xl font-semibold text-gray-800">Approved Universities (AICTE)</h1>
                            <p className='text-gray-600'>All the approved universities by AICTE are listed here.</p>
                        </div>
                    </div>
                    <div className='bg-green-50 px-4 py-2 rounded-lg border border-green-200'>
                        <span className='text-green-700 font-medium'>
                            {filteredInstitutions.length} Approved Institutions
                        </span>
                    </div>
                </div>

                {/* grid container */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {filteredInstitutions.map((institution, index) => {
                        const compliance = getComplianceStatus(institution.parameters)
                        const approvedApp = institution.applications?.find(app => app.approved_by === 'aicte' && app.isApproved === true)
                        
                        return (
                            <div 
                                key={institution._id || index}
                                onClick={() => handleInstitutionClick(institution)}
                                className='bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg hover:border-green-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 group'
                            >
                                {/* Card Header */}
                                <div className='p-6 border-b border-gray-100'>
                                    <div className='flex justify-between items-start'>
                                        <div>
                                            <div className='flex items-center gap-2 mb-2'>
                                                <h3 className='text-lg font-semibold text-gray-800 group-hover:text-green-700'>
                                                    {institution.name}
                                                </h3>
                                                <CheckCircle className='text-green-500 w-5 h-5' />
                                            </div>
                                            <div className='flex items-center gap-1 text-gray-600 mb-1'>
                                                <MapPin className='w-4 h-4' />
                                                <span className='text-sm'>{institution.district}, {institution.state}</span>
                                            </div>
                                        </div>
                                        <ChevronRight className='w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors' />
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className='p-6'>
                                    {/* Compliance Status */}
                                    <div className='mb-4'>
                                        <div className='flex justify-between items-center mb-2'>
                                            <span className='text-sm font-medium text-gray-700'>Compliance Score</span>
                                            <span className={`text-sm font-bold ${
                                                compliance.percentage >= 80 ? 'text-green-600' : 
                                                compliance.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                                            }`}>
                                                {compliance.percentage}%
                                            </span>
                                        </div>
                                        <div className='w-full bg-gray-200 rounded-full h-2'>
                                            <div 
                                                className={`h-2 rounded-full transition-all duration-500 ${
                                                    compliance.percentage >= 80 ? 'bg-green-500' : 
                                                    compliance.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                }`}
                                                style={{ width: `${compliance.percentage}%` }}
                                            ></div>
                                        </div>
                                        <div className='flex justify-between text-xs text-gray-500 mt-1'>
                                            <span>{compliance.compliant}/{compliance.total} Parameters</span>
                                            <span>{compliance.compliant >= compliance.total * 0.8 ? 'Excellent' : 
                                                  compliance.compliant >= compliance.total * 0.6 ? 'Good' : 'Needs Improvement'}</span>
                                        </div>
                                    </div>

                                    {/* Quick Info Grid */}
                                    <div className='grid grid-cols-2 gap-3 mb-4'>
                                        <div className='flex items-center gap-2'>
                                            <Award className='w-4 h-4 text-blue-600' />
                                            <div>
                                                <p className='text-xs text-gray-500'>NAAC Grade</p>
                                                <p className='text-sm font-medium text-gray-800'>{institution.NAAC_grade || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <TrendingUp className='w-4 h-4 text-purple-600' />
                                            <div>
                                                <p className='text-xs text-gray-500'>NIRF Rank</p>
                                                <p className='text-sm font-medium text-gray-800'>{institution.NIRF_rank || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <Calendar className='w-4 h-4 text-orange-600' />
                                            <div>
                                                <p className='text-xs text-gray-500'>Established</p>
                                                <p className='text-sm font-medium text-gray-800'>{institution.established_year}</p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <BookOpen className='w-4 h-4 text-indigo-600' />
                                            <div>
                                                <p className='text-xs text-gray-500'>Courses</p>
                                                <p className='text-sm font-medium text-gray-800'>{institution.courses?.length || 0}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Approval Info */}
                                    {approvedApp && (
                                        <div className='bg-green-50 border border-green-200 rounded-lg p-3'>
                                            <div className='flex items-center justify-between'>
                                                <div className='flex items-center gap-2'>
                                                    <Check className='w-4 h-4 text-green-600' />
                                                    <span className='text-sm font-medium text-green-700'>Approved by AICTE</span>
                                                </div>
                                                <span className='text-xs text-green-600'>
                                                    {formatDate(approvedApp.submitted_at)}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {filteredInstitutions.length === 0 && (
                    <div className='text-center py-12'>
                        <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4'>
                            <Building2 className='w-8 h-8 text-gray-400' />
                        </div>
                        <h3 className='text-lg font-medium text-gray-700 mb-2'>No Approved Institutions</h3>
                        <p className='text-gray-500 max-w-md mx-auto'>
                            There are currently no AICTE-approved institutions. Institutions will appear here once they are approved.
                        </p>
                    </div>
                )}

                {/* Sidebar for Detailed View */}
                <div className={`fixed inset-y-0 right-0 w-full md:w-2/3 lg:w-1/2 xl:w-2/5 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
                    sidebarOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                    {selectedInstitution && (
                        <div className="h-full flex flex-col overflow-hidden">
                            {/* Sidebar Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-600 p-2 rounded-lg">
                                        <Building2 className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">{selectedInstitution.name}</h2>
                                        <p className="text-green-600 font-medium flex items-center gap-1">
                                            <CheckCircle className="w-4 h-4" />
                                            Approved by AICTE
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeSidebar}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6 text-gray-500" />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {/* Institution Overview */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Institution Overview</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <MapPin className="w-5 h-5 text-blue-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Location</p>
                                                <p className="font-medium">{selectedInstitution.district}, {selectedInstitution.state}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <Calendar className="w-5 h-5 text-orange-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Established</p>
                                                <p className="font-medium">{selectedInstitution.established_year}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <Globe className="w-5 h-5 text-purple-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Website</p>
                                                <a href={selectedInstitution.website} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
                                                    {selectedInstitution.website}
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <Mail className="w-5 h-5 text-red-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Email</p>
                                                <p className="font-medium">{selectedInstitution.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Codes & Accreditation */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Accreditation & Codes</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            <p className="text-sm text-gray-600">AISHE Code</p>
                                            <p className="font-medium text-blue-700">{selectedInstitution.AISHE_code || 'N/A'}</p>
                                        </div>
                                        <div className="p-3 bg-green-50 rounded-lg">
                                            <p className="text-sm text-gray-600">NAAC Grade</p>
                                            <p className="font-medium text-green-700">{selectedInstitution.NAAC_grade || 'N/A'}</p>
                                        </div>
                                        <div className="p-3 bg-purple-50 rounded-lg">
                                            <p className="text-sm text-gray-600">NIRF Rank</p>
                                            <p className="font-medium text-purple-700">{selectedInstitution.NIRF_rank || 'N/A'}</p>
                                        </div>
                                        <div className="p-3 bg-orange-50 rounded-lg">
                                            <p className="text-sm text-gray-600">UDISE Code</p>
                                            <p className="font-medium text-orange-700">{selectedInstitution.UDISE_code || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Courses Offered */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Courses Offered</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedInstitution.courses?.map((course, index) => (
                                            <span key={index} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                                                {course}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Compliance Details */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Compliance Details</h3>
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-gray-700">Overall Compliance</span>
                                            <span className="text-2xl font-bold text-green-600">
                                                {getComplianceStatus(selectedInstitution.parameters).percentage}%
                                            </span>
                                        </div>
                                        <div className="bg-gray-200 rounded-full h-3">
                                            <div 
                                                className="bg-green-500 h-3 rounded-full transition-all duration-1000"
                                                style={{ width: `${getComplianceStatus(selectedInstitution.parameters).percentage}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                                            <span>{getComplianceStatus(selectedInstitution.parameters).compliant} Compliant</span>
                                            <span>{getComplianceStatus(selectedInstitution.parameters).total} Total Parameters</span>
                                        </div>
                                    </div>
                                    
                                    {/* Parameter Categories */}
                                    <div className="space-y-3">
                                        {selectedInstitution.parameters && (
                                            <div className="grid grid-cols-2 gap-3">
                                                {Array.from(new Set(selectedInstitution.parameters.map(p => p.parameter_category))).map((category, index) => {
                                                    const categoryParams = selectedInstitution.parameters.filter(p => p.parameter_category === category)
                                                    const compliantCount = categoryParams.filter(p => p.is_compliant === true).length
                                                    const percentage = Math.round((compliantCount / categoryParams.length) * 100)
                                                    
                                                    return (
                                                        <div key={index} className="p-3 border border-gray-200 rounded-lg">
                                                            <p className="font-medium text-gray-700 mb-1">{category}</p>
                                                            <div className="flex items-center justify-between">
                                                                <span className={`text-sm font-medium ${
                                                                    percentage === 100 ? 'text-green-600' : 
                                                                    percentage >= 80 ? 'text-green-500' :
                                                                    percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                                                                }`}>
                                                                    {percentage}%
                                                                </span>
                                                                <span className="text-xs text-gray-500">
                                                                    {compliantCount}/{categoryParams.length}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Approval Information */}
                                {selectedInstitution.applications && (
                                    <div className="mb-8">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Approval Information</h3>
                                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                            {selectedInstitution.applications.map((app, index) => (
                                                <div key={index} className="mb-3 last:mb-0">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            {app.isApproved ? (
                                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                                            ) : (
                                                                <AlertCircle className="w-5 h-5 text-yellow-600" />
                                                            )}
                                                            <span className={`font-medium ${
                                                                app.isApproved ? 'text-green-700' : 'text-yellow-700'
                                                            }`}>
                                                                {app.isApproved ? 'Approved' : 'Pending'} by {app.approved_by?.toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <span className="text-sm text-gray-500">
                                                            {formatDate(app.submitted_at)}
                                                        </span>
                                                    </div>
                                                    <div className="pl-7">
                                                        <p className="text-sm text-gray-600">Status: <span className="font-medium">{app.status}</span></p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Documents */}
                                {selectedInstitution.documents && selectedInstitution.documents.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Documents</h3>
                                        <div className="space-y-3">
                                            {selectedInstitution.documents.map((doc, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-white rounded border">
                                                            <Download className="w-4 h-4 text-gray-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-800">{doc.title}</p>
                                                        </div>
                                                    </div>
                                                    <a 
                                                        href={doc.file_url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                                                    >
                                                        View
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar Footer */}
                            <div className="p-6 border-t border-gray-200 bg-gray-50">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-600">Institution Code</p>
                                        <p className="font-medium">{selectedInstitution.institution_code}</p>
                                    </div>
                                    <button
                                        onClick={closeSidebar}
                                        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
                                    >
                                        Close Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Backdrop */}
                {sidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                        onClick={closeSidebar}
                    ></div>
                )}
            </div>
        </SuperAdminLayout>
    )
}

export default SuperAdminUniversities