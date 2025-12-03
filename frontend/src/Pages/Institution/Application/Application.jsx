import React, { useContext, useState } from "react";
import {
  PlusCircle,
  FileText,
  Building2,
  FileCheck,
  Folder,
  Download,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Eye,
  MapPin,
  Globe,
  Bot,
  Mail,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AppContext from "../../../Context/UseContext";

export default function InstitutionApplicationPage() {
  const navigate = useNavigate();
  const [expandedInstitution, setExpandedInstitution] = useState(null);
  const { institutionDetails } = useContext(AppContext);
  const [aiLoading, setAiLoading] = useState(false);

const handleAIAnalysis = async (applicationId) => {
  try {
    setAiLoading(true);

    const res = await fetch(
      `http://localhost:5000/api/ai/analyse/${applicationId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
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


  if (!institutionDetails || !institutionDetails.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-slate-600 font-medium">
            Loading applications...
          </div>
        </div>
      </div>
    );
  }

  const institutions = institutionDetails.data;

  const StatusBadge = ({ status }) => {
    const config = {
      compliant: {
        color: "bg-gradient-to-r from-emerald-500 to-green-500",
        icon: CheckCircle,
        text: "Compliant",
      },
      non_compliant: {
        color: "bg-gradient-to-r from-rose-500 to-pink-500",
        icon: XCircle,
        text: "Non-Compliant",
      },
      pending: {
        color: "bg-gradient-to-r from-amber-500 to-orange-500",
        icon: Clock,
        text: "Pending",
      },
    };

    const { color, icon: Icon, text } = config[status] || config.pending;

    return (
      <span
        className={`inline-flex items-center gap-1.5 ${color} text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-sm`}
      >
        <Icon size={14} />
        {text}
      </span>
    );
  };

  const ProgressCircle = ({ percentage, size = "medium" }) => {
    const sizes = {
      small: "w-16 h-16 text-sm",
      medium: "w-20 h-20 text-lg",
      large: "w-24 h-24 text-xl",
    };

    return (
      <div className="relative">
        <div
          className={`${sizes[size]} rounded-full flex items-center justify-center bg-gradient-to-r from-emerald-400 to-cyan-500 shadow-lg`}
        >
          <span className="text-white font-bold">{percentage}%</span>
        </div>
        <TrendingUp
          className="absolute -top-1 -right-1 text-emerald-600 bg-white rounded-full p-0.5 shadow-sm"
          size={18}
        />
      </div>
    );
  };

  const toggleInstitution = (id) => {
    setExpandedInstitution(expandedInstitution === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50/30 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 lg:mb-12">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent mb-3">
              Institution Applications
            </h1>
            <p className="text-slate-600 text-lg">
              Manage and track your institution registration progress
            </p>
          </div>
          <Link
            to="/institution/profile"
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <PlusCircle
              size={20}
              className="group-hover:scale-110 transition-transform"
            />
            New Application
          </Link>
        </div>

        {/* Applications Grid */}
        <div className="space-y-6 mb-16">
          {institutions.map((inst) => {
            const totalParams = inst.parameters?.length || 0;
            const completedParams =
              inst.parameters?.filter((p) => p?.is_compliant === true).length ||
              0;
            const parameterProgress =
              totalParams > 0
                ? Math.round((completedParams / totalParams) * 100)
                : 0;

            const totalDocs = inst.documents?.length || 0;
            const uploadedDocs =
              inst.documents?.filter((d) => d.file_url || d.fileUrl)?.length ||
              0;
            const documentProgress =
              totalDocs > 0 ? Math.round((uploadedDocs / totalDocs) * 100) : 0;

            const overallProgress = Math.round(
              ((completedParams / (totalParams || 1) +
                uploadedDocs / (totalDocs || 1)) /
                2) *
                100
            );

            const isExpanded = expandedInstitution === inst._id;

            return (
              <div
                key={inst._id}
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-white/60 hover:shadow-xl transition-all duration-500 overflow-hidden"
              >
                {/* Institution Header - Always Visible */}
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                          <Building2 className="text-white" size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 truncate">
                            {inst.name}
                          </h2>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="inline-block bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-medium">
                              {inst.type.toUpperCase()}
                            </span>
                            <div>
                              {inst.applications &&
                              inst.applications.length > 0 ? (
                                <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                                  <CheckCircle size={14} />
                                  Application Submitted
                                </span>
                              ) : (
                                <span className="text-sm text-amber-600 font-medium flex items-center gap-1">
                                  <Clock size={14} />
                                  In Progress
                                </span>
                              )}
                            </div>
                            <div>
                              <span className="text-sm text-slate-500 font-medium flex items-center gap-1">
                                <Clock size={14} />
                                Created on{" "}
                                {new Date(inst.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-slate-600 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-slate-400" />
                          <span>{inst.email}</span>
                        </div>
                        {inst.website && (
                          <div className="flex items-center gap-2">
                            <Globe size={16} className="text-slate-400" />
                            <a
                              href={`https://${inst.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                            >
                              {inst.website}
                              <ExternalLink size={14} />
                            </a>
                          </div>
                        )}
                        {inst.address && (
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-slate-400" />
                            <span>{inst.address}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress and Actions */}
                    <div className="flex items-center gap-4">
                      <ProgressCircle percentage={overallProgress} />
                      <button
                        onClick={() => toggleInstitution(inst._id)}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors p-2"
                      >
                        <Eye size={18} />
                        {isExpanded ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expandable Content */}
                {isExpanded && (
                  <div className="border-t border-slate-200/60 px-6 sm:px-8 py-6 bg-slate-50/50">
                    <div className="grid lg:grid-cols-2 gap-8">
                      {/* Left Column - Progress & Documents */}
                      <div className="space-y-6">
                        {/* Progress Bars */}
                        <div className="space-y-4">
                          <div>
                            <div
                              className="flex justify-between text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                              onClick={() =>
                                navigate(`/institution/parameters/${inst._id}`)
                              }
                            >
                              <span className="flex items-center gap-2">
                                <FileCheck size={16} />
                                Parameters
                              </span>
                              <span>{parameterProgress}%</span>
                            </div>
                            <div
                              className="w-full bg-slate-200 rounded-full h-2.5 cursor-pointer"
                              onClick={() =>
                                navigate(`/institution/parameters/${inst._id}`)
                              }
                            >
                              <div
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${parameterProgress}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                              {completedParams} of {totalParams} completed
                            </div>
                          </div>

                          <div>
                            <div
                              className="flex justify-between text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                              onClick={() =>
                                navigate(`/institution/documents/${inst._id}`)
                              }
                            >
                              <span className="flex items-center gap-2">
                                <FileText size={16} />
                                Documents
                              </span>
                              <span>{documentProgress}%</span>
                            </div>
                            <div
                              className="w-full bg-slate-200 rounded-full h-2.5 cursor-pointer"
                              onClick={() =>
                                navigate(`/institution/documents/${inst._id}`)
                              }
                            >
                              <div
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${documentProgress}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                              {uploadedDocs} of {totalDocs} uploaded
                            </div>
                          </div>
                        </div>

                        {/* Documents Section */}
                        {inst.documents?.length > 0 && (
                          <div>
                            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                              <Folder size={18} className="text-blue-600" />
                              Required Documents
                            </h3>
                            <div className="space-y-2">
                              {inst.documents.map((doc, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 rounded-xl bg-white/80 border border-slate-200/60 hover:border-blue-200/60 transition-colors"
                                >
                                  <span className="font-medium text-slate-700 text-sm truncate flex-1">
                                    {doc.name || doc.title}
                                  </span>
                                  {doc.file_url || doc.fileUrl ? (
                                    <a
                                      href={
                                        doc.file_url.includes(".pdf")
                                          ? doc.file_url
                                          : `${doc.file_url}.pdf`
                                      }
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm flex-shrink-0 ml-2"
                                    >
                                      View <ExternalLink size={14} />
                                    </a>
                                  ) : (
                                    <span className="text-rose-500 text-sm font-medium flex-shrink-0 ml-2">
                                      Pending
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* AI Report / analysis */}
                        {/* <div className="pt-4">
                          {inst.ai_report_url ? (
                            <button
                              className="group w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                              onClick={() =>
                                window.open(inst.ai_report_url, "_blank")
                              }
                            >
                              <Download
                                size={18}
                                className="group-hover:scale-110 transition-transform"
                              />
                              Download AI Compliance Report
                            </button>
                          ) : (
                            <>
                            <div className="text-center p-4 bg-amber-50 rounded-2xl border border-amber-200">
                              <Clock
                                className="mx-auto mb-2 text-amber-600"
                                size={20}
                              />
                              <span className="text-amber-700 font-medium text-sm">
                                AI Compliance Report not generated yet
                              </span>
                            </div>
                          </>
                          )}
                        </div> */}

                        {/* AI Analysis Section */}
<div className="pt-4 space-y-4">
  {inst.ai_analysis && inst.ai_analysis.length > 0 ? (
    inst.ai_analysis.map((analysis, index) => (
      <div
        key={index}
        className="p-4 bg-white/80 rounded-2xl border border-slate-200/60 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-slate-800 mb-3">
          AI Analysis {index + 1}
        </h3>

        {/* Institution Details */}
        {analysis.institution_details && (
          <div className="mb-3">
            <h4 className="font-medium text-slate-700 mb-1">Institution Details:</h4>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>Name: {analysis.institution_details.name}</li>
              <li>Category: {analysis.institution_details.category}</li>
              <li>Head: {analysis.institution_details.head_title} {analysis.institution_details.head_name}</li>
              <li>Corpus Fund: {analysis.institution_details.corpus_fund}</li>
              <li>Students: {analysis.institution_details.students}</li>
              <li>Faculty: {analysis.institution_details.faculty}</li>
              <li>Faculty Ratio: {analysis.institution_details.faculty_ratio}</li>
              <li>Admin Area: {analysis.institution_details.admin_area}</li>
              <li>Computers: {analysis.institution_details.computers}</li>
            </ul>
          </div>
        )}

        {/* Visual Detection */}
        {analysis.visual_detection && (
          <div className="mb-3">
            <h4 className="font-medium text-slate-700 mb-1">Visual Detection:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
              {Object.entries(analysis.visual_detection).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span>{key.replace("_", " ")}</span>
                  <span className={`font-medium ${value === "missing" ? "text-rose-500" : "text-green-600"}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scores */}
        {analysis.scores && (
          <div className="mb-3">
            <h4 className="font-medium text-slate-700 mb-1">Scores:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
              {Object.entries(analysis.scores).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span>{key.replace("_", " ")}</span>
                  <span className="font-medium text-blue-600">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Final Decision */}
        {analysis.final_decision && (
          <div>
            <h4 className="font-medium text-slate-700 mb-1">Final Decision:</h4>
            <div className="flex flex-col gap-1 text-sm text-slate-600">
              <span>Status: 
                <span className={`ml-1 font-semibold ${
                  analysis.final_decision.status === "Approved"
                    ? "text-green-600"
                    : analysis.final_decision.status === "Rejected"
                    ? "text-rose-500"
                    : "text-amber-500"
                }`}>
                  {analysis.final_decision.status}
                </span>
              </span>
              {analysis.final_decision.reasons.length > 0 && (
                <span>Reasons: {analysis.final_decision.reasons.join(", ")}</span>
              )}
            </div>
          </div>
        )}
      </div>
    ))
  ) : (
    // Button to run AI Analysis if no data
    <button
      onClick={() => handleAIAnalysis(inst._id)}
      disabled={aiLoading}
      className="flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg transition disabled:opacity-50"
    >
      <Bot className="w-5 h-5" />
      {aiLoading ? "Analysing..." : "Run AI Analysis"}
    </button>
  )}
</div>


                      </div>

                      {/* Right Column - Parameters */}
                      <div>
                        <div className="mb-6">
                          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <FileCheck size={18} className="text-blue-600" />
                            Compliance Parameters
                            <span className="text-slate-500 text-sm font-normal">
                              ({inst.parameters?.length || 0})
                            </span>
                          </h3>

                          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            {inst.parameters?.map((param) => {
                              let status = "pending";
                              if (param.is_compliant === true)
                                status = "compliant";
                              if (param.is_compliant === false)
                                status = "non_compliant";

                              return (
                                <div
                                  key={param._id}
                                  className="group p-4 rounded-2xl bg-white/80 border border-slate-200/60 hover:border-blue-200/60 hover:shadow-md transition-all duration-300"
                                >
                                  <div className="flex justify-between items-start gap-3">
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-semibold text-slate-800 text-sm mb-2 line-clamp-2">
                                        {param.parameter_name}
                                      </h4>
                                      {param.description && (
                                        <p className="text-slate-600 text-xs line-clamp-2">
                                          {param.description}
                                        </p>
                                      )}
                                    </div>
                                    <StatusBadge status={status} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Process Overview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-white/60 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">
            Application Process Overview
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Building2,
                title: "Institution Profile",
                description:
                  "Complete basic institution information and contact details.",
                features: [
                  "Basic details",
                  "Contact information",
                  "Location details",
                  "Accreditation info",
                ],
                color: "from-blue-500 to-indigo-600",
              },
              {
                icon: FileCheck,
                title: "Infrastructure Parameters",
                description:
                  "Provide infrastructure details and facility specifications.",
                features: [
                  "Building details",
                  "Classroom specs",
                  "Laboratory requirements",
                  "Administrative areas",
                ],
                color: "from-emerald-500 to-green-600",
              },
              {
                icon: FileText,
                title: "Document Upload",
                description:
                  "Upload all required supporting documents and certificates.",
                features: [
                  "Certificates",
                  "Infrastructure proofs",
                  "Financial documents",
                  "Legal documents",
                ],
                color: "from-purple-500 to-pink-600",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/60 hover:border-blue-200/60 hover:shadow-lg transition-all duration-500"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <item.icon className="text-white" size={22} />
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg">
                    {item.title}
                  </h3>
                </div>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                  {item.description}
                </p>
                <ul className="space-y-3">
                  {item.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center gap-3 text-sm text-slate-700"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
