import React, { useContext, useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AppContext from "../../Context/UseContext";
import axios from "axios";
import {
  CheckCircle,
  XCircle,
  FileText,
  Download,
  Building2,
  AlertCircle,
  User,
  Calendar,
  Hash,
  MapPin,
  Globe,
  BookOpen,
  BarChart3,
  Award,
  ChevronRight,
  Send,
  Clock,
} from "lucide-react";
import AICTELayout from "../../Components/AICTELayout";
import { toast, ToastContainer } from 'react-toastify';

const FinalApproval = () => {
  // const role = localStorage.getItem("userRole");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const institutionId = searchParams.get("institutionId");
  const applicationId = searchParams.get("applicationId");
  const { allInstitutionDetails } = useContext(AppContext);

  const [remarks, setRemarks] = useState("");
  const [decision, setDecision] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const institution = useMemo(
    () => allInstitutionDetails?.find((inst) => inst._id === institutionId),
    [allInstitutionDetails, institutionId]
  );

  const application = useMemo(
    () => institution?.applications?.find((app) => app._id === applicationId),
    [institution, applicationId]
  );

  // Calculate compliance statistics
  const complianceStats = useMemo(() => {
    if (!institution?.parameters) return null;
    const total = institution.parameters.length;
    const compliant = institution.parameters.filter(
      (p) => p.is_compliant
    ).length;
    const nonCompliant = total - compliant;
    const percentage = Math.round((compliant / total) * 100);

    return { total, compliant, nonCompliant, percentage };
  }, [institution]);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  if (!institution || !application) {
    return (
      <AICTELayout className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Application Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The requested application data could not be loaded. Please verify
            the URL or return to the dashboard.
          </p>
          <button
            onClick={() => navigate("/aicte/dashboard")}
            className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </AICTELayout>
    );
  }

  const handleApprove = () => {
    setDecision("approved");
    setShowConfirmation(true);
  };

  const handleReject = () => {
    setDecision("rejected");
    setShowConfirmation(true);
  };

  const confirmDecision = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`http://localhost:3000/api/institution/application/${applicationId}`, {
        action: decision === "approved" ? "approve" : "reject",
        remarks,
      }, { withCredentials: true });
      if (!response.ok) {
        toast.error("Failed to submit decision. Please try again.");
      }
      
      if(response.ok){
        console.log("FINAL DECISION:", {
        decision,
        institutionId,
        applicationId,
        remarks,
        timestamp: new Date().toISOString(),
      });
        toast.success(`Application ${decision === "approved" ? "approved" : "rejected"} successfully!`);
        // Redirect to dashboard or applications list
        navigate("/aicte/latest-application");
      }

      setIsSubmitting(false);
      setShowConfirmation(false);

    } catch (error) {
      console.error("Error submitting decision:", error.message);
      setIsSubmitting(false);
      toast.error("Failed to submit decision. Please try again.");
    }
  };

  return (
    <AICTELayout className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                AICTE Final Approval Panel
              </h1>
              <p className="text-gray-600 mt-2">
                Review and finalize institutional compliance assessment
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Clock className="text-gray-400" size={20} />
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Application Status */}
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Hash size={18} className="text-gray-400" />
                  <span className="font-semibold text-gray-700">
                    Application ID:
                  </span>
                  <code className="bg-gray-100 px-3 py-1 rounded-md font-mono">
                    {applicationId?.slice(-8)}
                  </code>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold ${
                      application.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : application.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {application.status === "approved" ? (
                      <CheckCircle size={16} />
                    ) : application.status === "rejected" ? (
                      <XCircle size={16} />
                    ) : null}
                    {application.status?.toUpperCase() || "PENDING REVIEW"}
                  </span>
                  <span className="text-gray-500 text-sm">
                    Submitted:{" "}
                    {new Date(
                      application.submittedAt || Date.now()
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Compliance Score */}
              {complianceStats && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-700">
                        {complianceStats.percentage}%
                      </div>
                      <div className="text-xs text-blue-600 font-medium">
                        Compliance Score
                      </div>
                    </div>
                    <div className="h-12 border-l border-blue-300"></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          {complianceStats.compliant}
                        </div>
                        <div className="text-xs text-gray-600">Compliant</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-600">
                          {complianceStats.nonCompliant}
                        </div>
                        <div className="text-xs text-gray-600">
                          Non-compliant
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Institution Details Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                <div className="flex items-center gap-3">
                  <Building2 className="text-white" size={24} />
                  <h2 className="text-xl font-bold text-white">
                    Institution Profile
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <User className="text-blue-600 mt-1" size={18} />
                      <div>
                        <p className="text-sm text-gray-500">
                          Institution Name
                        </p>
                        <p className="font-semibold text-gray-900">
                          {institution.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Globe className="text-blue-600 mt-1" size={18} />
                      <div>
                        <p className="text-sm text-gray-500">Website</p>
                        <a
                          href={institution.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {institution.website}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Hash className="text-blue-600 mt-1" size={18} />
                      <div>
                        <p className="text-sm text-gray-500">AISHE Code</p>
                        <p className="font-semibold text-gray-900">
                          {institution.AISHE_code}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Location & Rankings */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="text-blue-600 mt-1" size={18} />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-semibold text-gray-900">
                          {institution.district}, {institution.state} -{" "}
                          {institution.pincode}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="text-blue-600 mt-1" size={18} />
                      <div>
                        <p className="text-sm text-gray-500">Accreditations</p>
                        <div className="flex gap-2 mt-1">
                          {institution.NAAC_grade && (
                            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                              NAAC: {institution.NAAC_grade}
                            </span>
                          )}
                          {institution.NIRF_rank && (
                            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
                              NIRF: {institution.NIRF_rank}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Courses Offered Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <BookOpen className="text-blue-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">
                    Courses Offered
                  </h2>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold ml-auto">
                    {institution.courses?.length || 0} courses
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-3">
                  {institution.courses?.map((course, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-lg font-medium hover:shadow-md transition-shadow"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Compliance Analysis Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <BarChart3 className="text-blue-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">
                    AI Compliance Parameter Analysis
                  </h2>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 text-left font-semibold text-gray-700 border-b">
                        Category
                      </th>
                      <th className="p-4 text-left font-semibold text-gray-700 border-b">
                        Parameter
                      </th>
                      <th className="p-4 text-left font-semibold text-gray-700 border-b">
                        Norm
                      </th>
                      <th className="p-4 text-left font-semibold text-gray-700 border-b">
                        Institution
                      </th>
                      <th className="p-4 text-left font-semibold text-gray-700 border-b">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {institution.parameters?.map((param, index) => (
                      <tr
                        key={param._id || index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4 text-gray-700">
                          {param.parameter_category}
                        </td>
                        <td className="p-4 text-gray-800 font-medium">
                          {param.parameter_name}
                        </td>
                        <td className="p-4 text-gray-600">
                          {param.norm_value}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              param.institution_value >= param.norm_value
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {param.institution_value}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {param.is_compliant ? (
                              <>
                                <CheckCircle
                                  className="text-green-500"
                                  size={18}
                                />
                                <span className="text-green-700 font-semibold">
                                  Compliant
                                </span>
                              </>
                            ) : (
                              <>
                                <XCircle className="text-red-500" size={18} />
                                <span className="text-red-700 font-semibold">
                                  Non-compliant
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Documents Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <FileText className="text-blue-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">
                    Submitted Documents
                  </h2>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold ml-auto">
                    {institution.documents?.length || 0} files
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {institution.documents?.map((doc) => (
                    <div
                      key={doc._id}
                      className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {doc.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {doc.file_type || "PDF"} • {doc.file_size || "N/A"}
                          </p>
                        </div>
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-4 flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                        >
                          <Download size={16} />
                          View
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Decision Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-900 to-black p-6">
                  <h2 className="text-xl font-bold text-white">
                    Final AICTE Decision
                  </h2>
                  <p className="text-gray-300 text-sm mt-1">
                    Review complete - Ready for final verdict
                  </p>
                </div>

                <div className="p-6">
                  {/* Remarks Section */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Final Remarks & Observations
                    </label>
                    <textarea
                      rows="5"
                      placeholder="Provide detailed reasoning for your decision. Include any specific observations, concerns, or commendations..."
                      className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>Minimum 50 characters recommended</span>
                      <span>{remarks.length}/1000</span>
                    </div>
                  </div>

                  {/* Decision Buttons */}
                  <div className="space-y-4">
                    <button
                      onClick={handleApprove}
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3"
                    >
                      <CheckCircle size={22} />
                      Approve Application
                    </button>

                    <button
                      onClick={handleReject}
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white py-4 rounded-xl font-bold text-lg hover:from-red-600 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3"
                    >
                      <XCircle size={22} />
                      Reject Application
                    </button>
                  </div>

                  {/* Current Decision Display */}
                  {decision && (
                    <div
                      className={`mt-6 p-4 rounded-xl border ${
                        decision === "approved"
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-700">
                            Selected Decision
                          </p>
                          <p
                            className={`text-lg font-bold ${
                              decision === "approved"
                                ? "text-green-700"
                                : "text-red-700"
                            }`}
                          >
                            {decision.toUpperCase()}
                          </p>
                        </div>
                        <button
                          onClick={() => setDecision(null)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Quick Stats */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-700 mb-3">
                      Review Summary
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Parameters</span>
                        <span className="font-semibold">
                          {complianceStats?.total || 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Compliance Rate</span>
                        <span className="font-semibold text-green-600">
                          {complianceStats?.percentage || 0}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Documents Verified
                        </span>
                        <span className="font-semibold">
                          {institution.documents?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="text-center mb-6">
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                  decision === "approved"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {decision === "approved" ? (
                  <CheckCircle size={32} />
                ) : (
                  <XCircle size={32} />
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Confirm {decision === "approved" ? "Approval" : "Rejection"}
              </h3>
              <p className="text-gray-600">
                Are you sure you want to {decision} this application? This
                action cannot be undone.
              </p>
            </div>

            {remarks.length < 20 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="text-yellow-600 mt-0.5" size={18} />
                  <p className="text-sm text-yellow-800">
                    <strong>Recommendation:</strong> Adding detailed remarks is
                    recommended before finalizing.
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDecision}
                disabled={isSubmitting}
                className={`flex-1 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 ${
                  decision === "approved"
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    : "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Confirm {decision === "approved" ? "Approve" : "Reject"}
                  </>
                )}
              </button>
            </div>
          </div>
          <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
      )}
    </AICTELayout>
  );
};

export default FinalApproval;
