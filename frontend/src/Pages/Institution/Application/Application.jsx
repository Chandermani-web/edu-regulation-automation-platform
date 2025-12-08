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
  Sparkles,
  AlertCircle,
  BarChart3,
  Target,
  Users,
  BookOpen,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AppContext from "../../../Context/UseContext";

export default function InstitutionApplicationPage() {
  const navigate = useNavigate();
  const [expandedInstitution, setExpandedInstitution] = useState(null);
  const { institutionDetails } = useContext(AppContext);
  const [aiLoading, setAiLoading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleAIAnalysis = async (applicationId) => {
    try {
      setAiLoading(true);

      const res = await fetch(
        `http://localhost:5000/api/ai/analyse/${applicationId}`,
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

  if (!institutionDetails || !institutionDetails.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/10">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative animate-spin rounded-full h-16 w-16 border-[3px] border-blue-600 border-t-transparent mx-auto"></div>
          </div>
          <div className="space-y-2">
            <div className="text-slate-800 font-semibold">
              Loading applications
            </div>
            <div className="text-sm text-slate-500">
              Preparing your dashboard...
            </div>
          </div>
        </div>
      </div>
    );
  }

  const institutions = institutionDetails.data;

  const StatusBadge = ({ status }) => {
    const config = {
      compliant: {
        color:
          "bg-gradient-to-r from-emerald-500/10 to-green-500/10 text-emerald-700 border border-emerald-200",
        icon: CheckCircle,
        text: "Compliant",
        iconColor: "text-emerald-500",
      },
      non_compliant: {
        color:
          "bg-gradient-to-r from-rose-500/10 to-pink-500/10 text-rose-700 border border-rose-200",
        icon: XCircle,
        text: "Non-Compliant",
        iconColor: "text-rose-500",
      },
      pending: {
        color:
          "bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-700 border border-amber-200",
        icon: Clock,
        text: "Pending",
        iconColor: "text-amber-500",
      },
    };

    const {
      color,
      icon: Icon,
      text,
      iconColor,
    } = config[status] || config.pending;

    return (
      <span
        className={`inline-flex items-center gap-2 ${color} px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-sm transition-all duration-300 hover:scale-105 cursor-default`}
      >
        <Icon size={16} className={iconColor} />
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

    const getColor = (percent) => {
      if (percent >= 80) return "from-emerald-500 to-teal-500";
      if (percent >= 50) return "from-blue-500 to-cyan-500";
      return "from-amber-500 to-orange-500";
    };

    return (
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300 rounded-full"></div>
        <div
          className={`relative ${
            sizes[size]
          } rounded-full flex items-center justify-center bg-gradient-to-r ${getColor(
            percentage
          )} shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-all duration-300`}
        >
          <span className="text-white font-bold tracking-tight">
            {percentage}%
          </span>
        </div>
        <TrendingUp
          className="absolute -top-2 -right-2 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full p-1.5 shadow-lg"
          size={20}
        />
      </div>
    );
  };

  const toggleInstitution = (id) => {
    setExpandedInstitution(expandedInstitution === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 p-4 sm:p-6">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative mb-12 lg:mb-16">
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur-3xl opacity-10"></div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="mb-8 lg:mb-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="text-white" size={20} />
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
                  Institution Dashboard
                </h1>
              </div>
              <p className="text-slate-600 text-lg max-w-2xl leading-relaxed">
                Manage, track, and analyze your institution registration
                progress with real-time insights and AI-powered compliance
                checks.
              </p>
            </div>
            <Link
              to="/institution/profile"
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 active:translate-y-0 inline-flex items-center gap-3"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              <PlusCircle
                size={22}
                className="group-hover:rotate-90 transition-transform duration-500"
              />
              New Application
            </Link>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <Building2 className="text-blue-600" size={20} />
                </div>
                <span className="text-3xl font-bold text-slate-800">
                  {institutions.length}
                </span>
              </div>
              <div className="text-sm font-medium text-slate-600">
                Total Institutions
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl">
                  <CheckCircle className="text-emerald-600" size={20} />
                </div>
                <span className="text-3xl font-bold text-slate-800">
                  {
                    institutions.filter((i) => i.applications?.length > 0)
                      .length
                  }
                </span>
              </div>
              <div className="text-sm font-medium text-slate-600">
                Submitted Applications
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500/10 rounded-xl">
                  <BarChart3 className="text-purple-600" size={20} />
                </div>
                <span className="text-3xl font-bold text-slate-800">
                  {institutions.filter((i) => i.ai_analysis?.length > 0).length}
                </span>
              </div>
              <div className="text-sm font-medium text-slate-600">
                AI Analyzed
              </div>
            </div>
          </div>
        </div>

        {/* Applications Grid */}
        <div className="space-y-8 mb-20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
              Active Applications
            </h2>
            <div className="text-sm text-slate-500">
              Showing {institutions.length} institution
              {institutions.length !== 1 ? "s" : ""}
            </div>
          </div>

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
                className={`group bg-white/90 backdrop-blur-sm rounded-3xl shadow-sm border border-white/80 hover:border-blue-200/60 hover:shadow-2xl transition-all duration-500 overflow-hidden ${
                  isExpanded ? "ring-2 ring-blue-500/20" : ""
                }`}
                onMouseEnter={() => setHoveredCard(inst._id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Institution Header */}
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                    <div className="flex-1">
                      <div className="flex items-start gap-6 mb-6">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Building2 className="text-white" size={24} />
                          </div>
                          {hoveredCard === inst._id && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                              <Sparkles size={12} className="text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-3 mb-4">
                            <h2 className="text-2xl font-bold text-slate-800 truncate">
                              {inst.name}
                            </h2>
                            <span className="inline-block bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold border border-blue-200">
                              {inst.type.toUpperCase()}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-6">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-slate-100 rounded-lg">
                                <Mail size={14} className="text-slate-500" />
                              </div>
                              <span>{inst.email}</span>
                            </div>
                            {inst.website && (
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-slate-100 rounded-lg">
                                  <Globe size={14} className="text-slate-500" />
                                </div>
                                <a
                                  href={`https://${inst.website}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
                                >
                                  {inst.website}
                                  <ExternalLink size={12} />
                                </a>
                              </div>
                            )}
                            {inst.address && (
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-slate-100 rounded-lg">
                                  <MapPin
                                    size={14}
                                    className="text-slate-500"
                                  />
                                </div>
                                <span>{inst.address}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-4">
                            <StatusBadge
                              status={
                                inst.applications?.length > 0
                                  ? "compliant"
                                  : "pending"
                              }
                            />
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <Clock size={14} />
                              Created{" "}
                              {new Date(inst.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress and Actions */}
                    <div className="flex flex-col items-end gap-6">
                      <ProgressCircle percentage={overallProgress} />
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() =>
                            navigate(`/institution/parameters/${inst._id}`)
                          }
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 transition-colors"
                        >
                          <FileCheck size={16} />
                          Manage
                        </button>
                        <button
                          onClick={() => toggleInstitution(inst._id)}
                          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300"
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
                </div>

                {/* Expandable Content */}
                {isExpanded && (
                  <div className="border-t border-slate-200/60 px-8 py-8 bg-gradient-to-b from-white/50 to-slate-50/30">
                    <div className="grid lg:grid-cols-2 gap-10">
                      {/* Left Column - Progress & Documents */}
                      <div className="space-y-8">
                        {/* Progress Bars */}
                        <div className="space-y-6">
                          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-sm">
                            <h3 className="font-semibold text-slate-800 mb-6 flex items-center gap-3">
                              <Target size={20} className="text-blue-600" />
                              Progress Overview
                            </h3>
                            <div className="space-y-6">
                              <div>
                                <div className="flex justify-between items-center mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
                                    <span className="font-medium text-slate-800">
                                      Parameters
                                    </span>
                                  </div>
                                  <span className="text-lg font-bold text-slate-800">
                                    {parameterProgress}%
                                  </span>
                                </div>
                                <div
                                  className="w-full h-3 bg-slate-100 rounded-full overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() =>
                                    navigate(
                                      `/institution/parameters/${inst._id}`
                                    )
                                  }
                                >
                                  <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${parameterProgress}%` }}
                                  >
                                    <div className="w-full h-full bg-gradient-to-r from-white/30 to-transparent"></div>
                                  </div>
                                </div>
                                <div className="text-sm text-slate-500 mt-2">
                                  {completedParams} of {totalParams} completed
                                </div>
                              </div>

                              <div>
                                <div className="flex justify-between items-center mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                                    <span className="font-medium text-slate-800">
                                      Documents
                                    </span>
                                  </div>
                                  <span className="text-lg font-bold text-slate-800">
                                    {documentProgress}%
                                  </span>
                                </div>
                                <div
                                  className="w-full h-3 bg-slate-100 rounded-full overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() =>
                                    navigate(
                                      `/institution/documents/${inst._id}`
                                    )
                                  }
                                >
                                  <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${documentProgress}%` }}
                                  >
                                    <div className="w-full h-full bg-gradient-to-r from-white/30 to-transparent"></div>
                                  </div>
                                </div>
                                <div className="text-sm text-slate-500 mt-2">
                                  {uploadedDocs} of {totalDocs} uploaded
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Documents Section */}
                          {inst.documents?.length > 0 && (
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-sm">
                              <h3 className="font-semibold text-slate-800 mb-6 flex items-center gap-3">
                                <Folder size={20} className="text-purple-600" />
                                Required Documents
                              </h3>
                              <div className="space-y-3">
                                {inst.documents.map((doc, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-white to-slate-50/50 border border-slate-200/60 hover:border-blue-200/60 hover:shadow-sm transition-all duration-300 group/document"
                                  >
                                    <div className="flex items-center gap-4">
                                      <div className="p-2.5 bg-slate-100 rounded-lg group-hover/document:bg-blue-50 transition-colors">
                                        <FileText
                                          size={16}
                                          className="text-slate-600 group-hover/document:text-blue-600 transition-colors"
                                        />
                                      </div>
                                      <span className="font-medium text-slate-800 text-sm">
                                        {doc.name || doc.title}
                                      </span>
                                    </div>
                                    {doc.file_url || doc.fileUrl ? (
                                      <a
                                        href={doc.file_url || doc.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg"
                                      >
                                        View <ExternalLink size={14} />
                                      </a>
                                    ) : (
                                      <span className="text-amber-600 text-sm font-medium px-4 py-2 bg-amber-50 rounded-lg flex items-center gap-2">
                                        <Clock size={14} />
                                        Pending
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Column - Parameters & AI */}
                      <div className="space-y-8">
                        {/* Parameters Section */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-sm">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-slate-800 flex items-center gap-3">
                              <FileCheck
                                size={20}
                                className="text-emerald-600"
                              />
                              Compliance Parameters
                              <span className="text-slate-400 font-normal">
                                ({inst.parameters?.length || 0})
                              </span>
                            </h3>
                            <button
                              onClick={() =>
                                navigate(`/institution/parameters/${inst._id}`)
                              }
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                            >
                              View all →
                            </button>
                          </div>

                          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            {inst.parameters?.map((param) => {
                              let status = "pending";
                              if (param.is_compliant === true)
                                status = "compliant";
                              if (param.is_compliant === false)
                                status = "non_compliant";

                              return (
                                <div
                                  key={param._id}
                                  className="group p-5 rounded-xl bg-gradient-to-r from-white to-slate-50/50 border border-slate-200/60 hover:border-blue-200/60 hover:shadow-md transition-all duration-300"
                                >
                                  <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-semibold text-slate-800 text-sm mb-2 leading-relaxed">
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

                      {/* AI Analysis Section */}
                      <div className="col-span-2">
                        <div className="pt-4 space-y-4 grid grid-cols-2 gap-6">
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
                                    <h4 className="font-medium text-slate-700 mb-1">
                                      Institution Details:
                                    </h4>
                                    <ul className="text-sm text-slate-600 space-y-1">
                                      <li>
                                        Name:{" "}
                                        {analysis.institution_details.name}
                                      </li>
                                      <li>
                                        Category:{" "}
                                        {analysis.institution_details.category}
                                      </li>
                                      <li>
                                        Head:{" "}
                                        {
                                          analysis.institution_details
                                            .head_title
                                        }{" "}
                                        {analysis.institution_details.head_name}
                                      </li>
                                      <li>
                                        Corpus Fund:{" "}
                                        {
                                          analysis.institution_details
                                            .corpus_fund
                                        }
                                      </li>
                                      <li>
                                        Students:{" "}
                                        {analysis.institution_details.students}
                                      </li>
                                      <li>
                                        Faculty:{" "}
                                        {analysis.institution_details.faculty}
                                      </li>
                                      <li>
                                        Faculty Ratio:{" "}
                                        {
                                          analysis.institution_details
                                            .faculty_ratio
                                        }
                                      </li>
                                      <li>
                                        Admin Area:{" "}
                                        {
                                          analysis.institution_details
                                            .admin_area
                                        }
                                      </li>
                                      <li>
                                        Computers:{" "}
                                        {analysis.institution_details.computers}
                                      </li>
                                    </ul>
                                  </div>
                                )}

                                {/* Visual Detection */}
                                {analysis.visual_detection && (
                                  <div className="mb-3">
                                    <h4 className="font-medium text-slate-700 mb-1">
                                      Visual Detection:
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                                      {Object.entries(
                                        analysis.visual_detection
                                      ).map(([key, value]) => (
                                        <div
                                          key={key}
                                          className="flex justify-between"
                                        >
                                          <span>{key.replace("_", " ")}</span>
                                          <span
                                            className={`font-medium ${
                                              value === "missing"
                                                ? "text-rose-500"
                                                : "text-green-600"
                                            }`}
                                          >
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
                                    <h4 className="font-medium text-slate-700 mb-1">
                                      Scores:
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                                      {Object.entries(analysis.scores).map(
                                        ([key, value]) => (
                                          <div
                                            key={key}
                                            className="flex justify-between"
                                          >
                                            <span>{key.replace("_", " ")}</span>
                                            <span className="font-medium text-blue-600">
                                              {value}
                                            </span>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Final Decision */}
                                {analysis.final_decision && (
                                  <div>
                                    <h4 className="font-medium text-slate-700 mb-1">
                                      Final Decision:
                                    </h4>
                                    <div className="flex flex-col gap-1 text-sm text-slate-600">
                                      <span>
                                        Status:
                                        <span
                                          className={`ml-1 font-semibold ${
                                            analysis.final_decision.status ===
                                            "Approved"
                                              ? "text-green-600"
                                              : analysis.final_decision
                                                  .status === "Rejected"
                                              ? "text-rose-500"
                                              : "text-amber-500"
                                          }`}
                                        >
                                          {analysis.final_decision.status}
                                        </span>
                                      </span>
                                      {analysis.final_decision.reasons.length >
                                        0 && (
                                        <span>
                                          Reasons:{" "}
                                          {analysis.final_decision.reasons.join(
                                            ", "
                                          )}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            // Button to run AI Analysis if no data
                            <button
                              onClick={() =>
                                handleAIAnalysis(inst.applications?._id)
                              }
                              disabled={aiLoading}
                              className="flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg transition disabled:opacity-50"
                            >
                              <Bot className="w-5 h-5" />
                              {aiLoading ? "Analysing..." : "Run AI Analysis"}
                            </button>
                          )}
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
        <div className="relative mb-20">
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur-3xl opacity-5"></div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-white/60 p-8 sm:p-12 relative">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                Streamlined Application Process
              </h2>
              <p className="text-slate-600 text-lg max-w-3xl mx-auto">
                Follow these simple steps to complete your institution
                registration with confidence
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Building2,
                  title: "Profile Setup",
                  description:
                    "Establish your institution's foundation with comprehensive details.",
                  features: [
                    "Basic information",
                    "Contact details",
                    "Location data",
                    "Accreditation",
                  ],
                  color: "from-blue-500 to-cyan-500",
                  step: "01",
                },
                {
                  icon: Users,
                  title: "Infrastructure",
                  description:
                    "Document facilities and resources for regulatory compliance.",
                  features: [
                    "Building specs",
                    "Classroom details",
                    "Laboratory setup",
                    "Administrative areas",
                  ],
                  color: "from-emerald-500 to-teal-500",
                  step: "02",
                },
                {
                  icon: BookOpen,
                  title: "Documentation",
                  description:
                    "Upload verified documents for comprehensive validation.",
                  features: [
                    "Legal certificates",
                    "Financial proofs",
                    "Infrastructure evidence",
                    "Compliance docs",
                  ],
                  color: "from-purple-500 to-pink-500",
                  step: "03",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/60 rounded-2xl p-8 hover:border-blue-200/60 hover:shadow-xl transition-all duration-500"
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {item.step}
                  </div>

                  <div className="mb-8">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}
                    >
                      <item.icon className="text-white" size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <ul className="space-y-4">
                    {item.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-4 text-slate-700 group/feature"
                      >
                        <div
                          className={`w-2 h-2 bg-gradient-to-r ${item.color} rounded-full flex-shrink-0 group-hover/feature:scale-150 transition-transform duration-300`}
                        ></div>
                        <span className="text-sm font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-sm text-slate-500 pb-8">
          <p>
            Need help? Contact our support team or refer to our documentation
            for guidance.
          </p>
          <p className="mt-2">
            All data is securely encrypted and processed in compliance with
            regulations.
          </p>
        </div>
      </div>
    </div>
  );
}
