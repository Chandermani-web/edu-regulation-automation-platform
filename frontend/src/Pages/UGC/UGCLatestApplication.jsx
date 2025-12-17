import React, { useContext, useState, useEffect } from "react";
import AICTELayout from "../../Components/AICTELayout.jsx";
import {
  Search,
  Eye,
  ChevronUp,
  ChevronDown,
  FileCheck,
  FileText,
  Folder,
  ExternalLink,
  Download,
  Clock,
  Bot,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppContext from "../../Context/UseContext.jsx";

// Status Badge Component
const StatusBadge = ({ status }) => {
  const variants = {
    compliant: "bg-emerald-50 text-emerald-700 border-emerald-200",
    non_compliant: "bg-rose-50 text-rose-700 border-rose-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
  };

  const labels = {
    compliant: "Compliant",
    non_compliant: "Non-Compliant",
    pending: "Pending",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border ${
        variants[status] || variants.pending
      }`}
    >
      {labels[status] || "Pending"}
    </span>
  );
};

const UGCLatestApplication = () => {
  const [expandedInstitution, setExpandedInstitution] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [ugcApplications, setUgcApplications] = useState([]);
  const [totalParameterTemplates, setTotalParameterTemplates] = useState(120); // Default fallback
  const { allInstitutionDetails, allApplicationDetails, getApiUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [aiLoading, setAiLoading] = useState(false);

  const handleAIAnalysis = async (applicationId) => {
    try {
      setAiLoading(true);

      const res = await fetch(
        `http://localhost:3000/api/ai-analysis/process/${applicationId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "AI Analysis failed");
      }

      alert("✅ AI Analysis Completed Successfully");

      // Optionally reload or re-fetch data
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("❌ AI Analysis Error");
    } finally {
      setAiLoading(false);
    }
  };

  // Fetch total parameter templates count
  useEffect(() => {
    const fetchTotalTemplates = async () => {
      try {
        const response = await fetch(`${getApiUrl()}/api/super-admin/parameter-templates`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        
        if (response.ok) {
          const result = await response.json();
          const activeTemplates = result.data?.filter(t => t.is_active !== false) || result.data || [];
          setTotalParameterTemplates(activeTemplates.length);
          console.log('Total active parameter templates:', activeTemplates.length);
        }
      } catch (error) {
        console.error("Error fetching parameter templates:", error);
        // Keep default value of 120
      }
    };
    
    fetchTotalTemplates();
  }, [getApiUrl]);

  // Filter AICTE institutions and prepare application data
  useEffect(() => {
    console.log('AICTELatestApplication - allInstitutionDetails:', allInstitutionDetails);
    if (allInstitutionDetails) {
      const filtered = allInstitutionDetails
        .filter(
          (institution) =>
            (institution.type === "university") &&
            institution.applications?.some(
              (app) => app.status === "submitted" && app.isApproved !== true
            )
        )
        .flatMap(
          (institution) => {
            console.log('Institution parameters:', institution.name, institution.parameters);
            if (institution.parameters?.length > 0) {
              console.log('First parameter sample:', institution.parameters[0].parameter_template_id);
            }
            return institution.applications?.map((application) => ({
              ...application,
              institution: institution,
            })) || [];
          }
        );
      console.log('UGCLatestApplication - filtered applications:', filtered);
      setUgcApplications(filtered);
    }
  }, [allInstitutionDetails]);
  
  const calculateParameterProgress = (institution) => {
    if (!institution.parameters || institution.parameters.length === 0)
      return 0;

    // Count parameters that have institution_value filled (not empty)
    const filledParams = institution.parameters.filter(
      (param) => param.institution_value && param.institution_value.trim() !== ''
    ).length;

    return Math.round((filledParams / totalParameterTemplates) * 100);
  };

  // Calculate progress for documents
  const calculateDocumentProgress = (institution) => {
    if (!institution.documents || institution.documents.length === 0) return 0;

    const uploadedDocs = institution.documents.filter(
      (doc) => doc.file_url || doc.fileUrl
    ).length;

    return Math.round((uploadedDocs / institution.documents.length) * 100);
  };

  // Filter applications based on search term
  const filteredApplications = ugcApplications.filter((app) => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();
    const institution = app.institution;

    return (
      institution.name?.toLowerCase().includes(term) ||
      app._id?.toLowerCase().includes(term)
    );
  });

  return (
    <AICTELayout className="">
      <div className="flex flex-col">
        <div className="tracking-wide mb-8 leading-0.5">
          <h2 className="text-2xl font-semibold mb-4">
            Latest Applications (AICTE)
          </h2>
          <p className="text-gray-700">
            Review and process new AICTE institutional applications
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              Showing only AICTE institutions
            </span>
            <span className="text-sm text-gray-600">
              {ugcApplications.length} application
              {ugcApplications.length !== 1 ? "s" : ""} found
            </span>
          </div>
        </div>

        <div className="overflow-x-auto p-5 bg-white rounded-lg shadow-md">
          <div className="border-2 border-gray-500 rounded-md p-4 mb-4 flex items-center">
            <Search className="inline-block mr-2 text-gray-500" />
            <input
              type="search"
              placeholder="Search by institution name and application id..."
              className="w-full border-2 border-gray-300 rounded-md p-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Institution Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application Id
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    State
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submission Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    AI Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map(
                  ({ _id: appId, submitted_at, status, institution }) => {
                    const isExpanded = expandedInstitution === appId;
                    const parameterProgress =
                      calculateParameterProgress(institution);
                    const documentProgress =
                      calculateDocumentProgress(institution);
                    const completedParams =
                      institution.parameters?.filter(
                        (param) => param.institution_value && param.institution_value.trim() !== ''
                      ).length || 0;
                    const totalParams = totalParameterTemplates;
                    const uploadedDocs =
                      institution.documents?.filter(
                        (doc) => doc.file_url || doc.fileUrl
                      ).length || 0;
                    const totalDocs = institution.documents?.length || 0;

                    return (
                      <React.Fragment key={appId}>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {institution.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {appId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {institution.state}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                              {institution.type.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(submitted_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {institution.ai_analysis[0].ai_total_score || "0"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {institution.riskLevel || "0"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                status === "submitted"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {status === "submitted" ? "Pending" : status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex gap-2">
                            <button
                              onClick={() =>
                                setExpandedInstitution(
                                  isExpanded ? null : appId
                                )
                              }
                              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors p-2"
                            >
                              {/* <Eye size={18} /> */}
                              {isExpanded ? (
                                <ChevronUp size={18} />
                              ) : (
                                <ChevronDown size={18} />
                              )}
                            </button>
                          </td>
                        </tr>

                        {/* Expandable Content */}
                        {isExpanded && (
                          <tr>
                            <td colSpan={9} className="px-0">
                              <div className="border-t border-slate-200/60 px-6 sm:px-8 py-6 bg-slate-50/50">
                                <div className="grid lg:grid-cols-2 gap-8">
                                  {/* Left Column - Progress & Documents */}
                                  <div className="space-y-6">
                                    {/* Progress Bars */}
                                    <div className="space-y-4">
                                      <div>
                                        <div className="flex justify-between text-sm font-medium text-slate-700 mb-2 cursor-pointer">
                                          <span className="flex items-center gap-2">
                                            <FileCheck size={16} />
                                            Parameters
                                          </span>
                                          <span>{parameterProgress}%</span>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-2.5 cursor-pointer">
                                          <div
                                            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
                                            style={{
                                              width: `${parameterProgress}%`,
                                            }}
                                          ></div>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">
                                          {completedParams} of {totalParams}{" "}
                                          completed
                                        </div>
                                      </div>

                                      <div>
                                        <div className="flex justify-between text-sm font-medium text-slate-700 mb-2 cursor-pointer">
                                          <span className="flex items-center gap-2">
                                            <FileText size={16} />
                                            Documents
                                          </span>
                                          <span>{documentProgress}%</span>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-2.5 cursor-pointer">
                                          <div
                                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
                                            style={{
                                              width: `${documentProgress}%`,
                                            }}
                                          ></div>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">
                                          {uploadedDocs} of {totalDocs} uploaded
                                        </div>
                                      </div>
                                    </div>

                                    {/* Documents Section */}
                                    {institution.documents?.length > 0 && (
                                      <div>
                                        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                          <Folder
                                            size={18}
                                            className="text-blue-600"
                                          />
                                          Required Documents
                                        </h3>
                                        <div className="space-y-2">
                                          {institution.documents.map(
                                            (doc, index) => (
                                              <div
                                                key={index}
                                                className="flex items-center justify-between p-3 rounded-xl bg-white/80 border border-slate-200/60 hover:border-blue-200/60 transition-colors"
                                              >
                                                <span className="font-medium text-slate-700 text-sm truncate flex-1">
                                                  {doc.title || doc.name}
                                                </span>
                                                {doc.file_url ? (
                                                  <a
                                                    href={doc.file_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm flex-shrink-0 ml-2"
                                                  >
                                                    View{" "}
                                                    <ExternalLink size={14} />
                                                  </a>
                                                ) : (
                                                  <span className="text-rose-500 text-sm font-medium flex-shrink-0 ml-2">
                                                    Pending
                                                  </span>
                                                )}
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* AI Report Section */}
                                    <div>
                                      <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                        <FileText
                                          size={18}
                                          className="text-emerald-600"
                                        />
                                        AI Compliance Report
                                      </h3>
                                      {(() => {
                                        // Find the corresponding application from allApplicationDetails
                                        const currentApp = allApplicationDetails?.find(
                                          app => app._id === appId
                                        );
                                        
                                        // Get the latest report from ai_report array
                                        const aiReports = currentApp?.ai_report || [];
                                        const latestReport = aiReports.length > 0 ? aiReports[aiReports.length - 1] : null;
                                        const reportUrl = latestReport?.report_url;
                                        const reportTitle = latestReport?.report_title || "AI Generated Compliance Report";

                                        return reportUrl ? (
                                          <div className="p-3 rounded-xl bg-white/80 border border-slate-200/60 hover:border-emerald-200/60 transition-colors">
                                            <a
                                              href={reportUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="flex items-center justify-between group"
                                            >
                                              <div className="flex-1">
                                                <span className="font-medium text-slate-700 text-sm block">
                                                  {reportTitle}
                                                </span>
                                                {latestReport?.created_at && (
                                                  <span className="text-xs text-slate-500 mt-1 block">
                                                    Generated: {new Date(latestReport.created_at).toLocaleString()}
                                                  </span>
                                                )}
                                              </div>
                                              <div className="flex items-center gap-2 text-emerald-600 group-hover:text-emerald-700 font-medium text-sm shrink-0 ml-2">
                                                View Report
                                                <ExternalLink size={14} />
                                              </div>
                                            </a>
                                          </div>
                                        ) : (
                                          <div className="text-center p-4 bg-amber-50 rounded-xl border border-amber-200">
                                            <Clock
                                              className="mx-auto mb-2 text-amber-600"
                                              size={20}
                                            />
                                            <span className="text-amber-700 font-medium text-sm">
                                              AI Compliance Report not generated yet
                                            </span>
                                          </div>
                                        );
                                      })()}
                                    </div>

                                  </div>

                                  {/* Right Column - Parameters */}
                                  <div>
                                    <div className="mb-6">
                                      <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                        <FileCheck
                                          size={18}
                                          className="text-blue-600"
                                        />
                                        Compliance Parameters
                                        <span className="text-slate-500 text-sm font-normal">
                                          ({institution.parameters?.length || 0}
                                          )
                                        </span>
                                      </h3>

                                      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                        {institution.parameters?.length > 0 ? (
                                          institution.parameters.map(
                                            (param, index) => {
                                              console.log(`Parameter ${index}:`, param);
                                              let status = "pending";
                                              if (param.is_compliant === true)
                                                status = "compliant";
                                              if (param.is_compliant === false)
                                                status = "non_compliant";

                                              // Get template data (nested) - handle both populated and unpopulated
                                              const template = typeof param.parameter_template_id === 'object' && param.parameter_template_id !== null 
                                                ? param.parameter_template_id 
                                                : {};
                                              const paramName = template.parameter_name || param.parameter_name || 'Unnamed Parameter';
                                              const paramDescription = template.description || param.description || '';
                                              const paramCategory = template.parameter_category || param.parameter_category || '';

                                              return (
                                                <div
                                                  key={param._id || index}
                                                  className="group p-4 rounded-2xl bg-white/80 border border-slate-200/60 hover:border-blue-200/60 hover:shadow-md transition-all duration-300"
                                                >
                                                  <div className="flex justify-between items-start gap-3">
                                                    <div className="flex-1 min-w-0">
                                                      <h4 className="font-semibold text-slate-800 text-sm mb-2 line-clamp-2">
                                                        {paramName}
                                                      </h4>
                                                      {paramDescription && (
                                                        <p className="text-slate-600 text-xs line-clamp-2">
                                                          {paramDescription}
                                                        </p>
                                                      )}
                                                      {paramCategory && (
                                                        <p className="text-slate-500 text-xs mt-1">
                                                          Category: {paramCategory}
                                                        </p>
                                                      )}
                                                      {param.institution_value && (
                                                        <p className="text-blue-600 text-xs mt-1 font-medium">
                                                          Value: {param.institution_value}
                                                        </p>
                                                      )}
                                                    </div>
                                                    <StatusBadge
                                                      status={status}
                                                    />
                                                  </div>
                                                </div>
                                              );
                                            }
                                          )
                                        ) : (
                                          <div className="text-center py-8 text-slate-500">
                                            No parameters found
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div>
                                      <button
                                        onClick={() =>
                                          navigate(
                                            `/aicte/final-approval?institutionId=${institution._id}&applicationId=${appId}`
                                          )
                                        }
                                        className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                                      >
                                        <ExternalLink
                                          size={18}
                                          className="group-hover:scale-110 transition-transform"
                                        />
                                        Approval Application
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  }
                )}
              </tbody>
            </table>

            {filteredApplications.length === 0 && (
              <div className="text-center py-8">
                {searchTerm ? (
                  <div className="text-gray-500">
                    <p>No AICTE applications found matching "{searchTerm}"</p>
                    <button
                      onClick={() => setSearchTerm("")}
                      className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Clear search
                    </button>
                  </div>
                ) : (
                  <div className="text-gray-500">
                    <p>No AICTE applications found</p>
                    <p className="text-sm mt-1">
                      All applications shown here are for AICTE institutions
                      only
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AICTELayout>
  );
};

export default UGCLatestApplication;
