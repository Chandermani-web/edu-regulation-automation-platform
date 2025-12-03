import React, { useContext, useMemo, useState, useEffect } from "react";
import {
  FileCheck,
  CheckCircle,
  XCircle,
  Clock,
  MessagesSquare,
  Bot,
  Building2,
  AlertTriangle,
  Download,
  Eye,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Image as ImageIcon,
  Percent,
  Search,
  Filter,
  SortAsc,
  ChevronRight,
  ChevronLeft,
  MoreVertical,
  TrendingUp,
  Users,
  FileText,
  BarChart3,
  Shield
} from "lucide-react";

import AppContext from "../../../Context/UseContext";
import { useNavigate } from "react-router-dom";

const InstitutionDashboard = () => {
  const navigate = useNavigate();
  const { institutionDetails, applicationDetails } = useContext(AppContext);

  const institution = institutionDetails?.data?.[0] || {};
  const aiAnalysis = institutionDetails?.ai_analysis || [];
  const aiData = aiAnalysis?.[0] || {};

  const applications = Array.isArray(applicationDetails)
    ? applicationDetails
    : [];

  /* -------------------- STATES -------------------- */
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [expandedApplication, setExpandedApplication] = useState(null);

  /* -------------------- STATS -------------------- */
  const stats = useMemo(() => ({
    totalApplications: applications.length,
    approved: applications.filter(a => a.status === "approved").length,
    pending: applications.filter(a => a.status === "pending").length,
    rejected: applications.filter(a => a.status === "rejected").length,
    activeQueries: institution?.queries?.length || 0,
    documentsUploaded: institution?.documents?.uploaded || 0,
    totalDocuments: institution?.documents?.total || 0,
    aiScore: aiData?.ai_total_score || 0,
    approvalRate: applications.length > 0 
      ? Math.round((applications.filter(a => a.status === "approved").length / applications.length) * 100) 
      : 0
  }), [applications, institution, aiData]);

  /* -------------------- FILTER + SEARCH + SORT -------------------- */
  const filteredApplications = useMemo(() => {
    let data = [...applications];

    // 🔍 Search
    if (search.trim() !== "") {
      const searchLower = search.toLowerCase();
      data = data.filter(app =>
        app?.institution_id?.name?.toLowerCase().includes(searchLower) ||
        app?._id?.toLowerCase().includes(searchLower) ||
        app?.institution_id?.email?.toLowerCase().includes(searchLower)
      );
    }

    // 🎯 Status filter
    if (statusFilter !== "all") {
      data = data.filter(app => app.status === statusFilter);
    }

    // 🔃 Sorting
    const sortFunctions = {
      newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      oldest: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      name: (a, b) => (a.institution_id?.name || "").localeCompare(b.institution_id?.name || ""),
      status: (a, b) => (a.status || "").localeCompare(b.status || "")
    };

    if (sortFunctions[sortBy]) {
      data.sort(sortFunctions[sortBy]);
    }

    return data;
  }, [applications, search, statusFilter, sortBy]);

  /* -------------------- PAGINATION -------------------- */
  const totalPages = Math.ceil(filteredApplications.length / perPage);
  const paginatedApplications = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredApplications.slice(start, start + perPage);
  }, [page, perPage, filteredApplications]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  /* -------------------- STATUS UTILITIES -------------------- */
  const getStatusConfig = (status) => {
    const configs = {
      approved: {
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: <CheckCircle className="w-4 h-4" />
      },
      pending: {
        color: "bg-amber-50 text-amber-700 border-amber-200",
        icon: <Clock className="w-4 h-4" />
      },
      rejected: {
        color: "bg-rose-50 text-rose-700 border-rose-200",
        icon: <XCircle className="w-4 h-4" />
      }
    };
    return configs[status] || { color: "bg-gray-50 text-gray-700 border-gray-200", icon: null };
  };

  const getAIScoreColor = (score) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-rose-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Institution Dashboard
                </h1>
                <p className="text-gray-600">
                  Welcome back, <span className="font-semibold text-blue-600">{institution?.name || "Institution"}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border">
              <Shield className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">ID: {institution?._id || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* KEY METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Applications"
            value={stats.totalApplications}
            change={"+12%"}
            icon={<FileText className="w-5 h-5" />}
            color="blue"
          />
          <MetricCard
            title="Approval Rate"
            value={`${stats.approvalRate}%`}
            change={"+5%"}
            icon={<TrendingUp className="w-5 h-5" />}
            color="emerald"
          />
          <MetricCard
            title="Pending Review"
            value={stats.pending}
            icon={<Clock className="w-5 h-5" />}
            color="amber"
          />
          <MetricCard
            title="AI Confidence Score"
            value={`${stats.aiScore}%`}
            icon={<Bot className="w-5 h-5" />}
            color="purple"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">

            {/* APPLICATIONS PANEL */}
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FileCheck className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Applications</h2>
                      <p className="text-sm text-gray-500">Manage and review all submissions</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Showing {paginatedApplications.length} of {filteredApplications.length}
                  </div>
                </div>

                {/* CONTROLS */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Search applications..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  <select
                    className="border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  <select
                    className="border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="name">By Name</option>
                    <option value="status">By Status</option>
                  </select>

                  <select
                    className="border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    value={perPage}
                    onChange={(e) => setPerPage(Number(e.target.value))}
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                  </select>
                </div>
              </div>

              {/* APPLICATIONS LIST */}
              <div className="divide-y">
                {paginatedApplications.length === 0 ? (
                  <div className="p-12 text-center">
                    <FileCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No applications found</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                  </div>
                ) : (
                  paginatedApplications.map((app) => {
                    const statusConfig = getStatusConfig(app.status);
                    return (
                      <div
                        key={app._id}
                        className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setExpandedApplication(
                          expandedApplication === app._id ? null : app._id
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-semibold text-gray-900">
                                {app.institution_id?.name || "Unnamed Institution"}
                              </h3>
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig.color} flex items-center gap-1`}>
                                {statusConfig.icon}
                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(app.createdAt).toLocaleDateString()}
                              </span>
                              <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                                ID: {app._id.slice(-6)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition" onClick={()=>navigate("/institution/application")}>
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Page {page} of {totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="p-2 border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        const pageNum = i + 1;
                        if (totalPages > 5) {
                          // Handle ellipsis for many pages
                          if (page > 3 && i === 0) {
                            return (
                              <React.Fragment key="start-ellipsis">
                                <button
                                  onClick={() => setPage(1)}
                                  className="w-10 h-10 border rounded-lg hover:bg-gray-50 transition"
                                >
                                  1
                                </button>
                                <span className="px-2">...</span>
                              </React.Fragment>
                            );
                          }
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`w-10 h-10 border rounded-lg transition ${
                              page === pageNum
                                ? "bg-blue-600 text-white border-blue-600"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="p-2 border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* INSTITUTION PROFILE */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Institution Profile</h2>
                  <p className="text-sm text-gray-500">Complete institution details</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <DetailCard
                  label="Basic Information"
                  items={[
                    { label: "Institution Name", value: institution?.name },
                    { label: "AISHE Code", value: institution?.AISHE_code },
                    { label: "NAAC Grade", value: institution?.NAAC_grade },
                    { label: "District", value: institution?.district }
                  ]}
                />
                <DetailCard
                  label="Contact Details"
                  items={[
                    { icon: <Mail className="w-4 h-4" />, label: "Email", value: institution?.email },
                    { icon: <Phone className="w-4 h-4" />, label: "Phone", value: institution?.phone },
                    { icon: <MapPin className="w-4 h-4" />, label: "Address", value: institution?.full_address }
                  ]}
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">

            {/* AI SCORE CARD */}
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Analysis Score</h3>
                    <p className="text-sm text-indigo-100">Comprehensive assessment</p>
                  </div>
                </div>
                <span className={`text-2xl font-bold ${getAIScoreColor(stats.aiScore)}`}>
                  {stats.aiScore}%
                </span>
              </div>
              <div className="space-y-3">
                <ScoreBar label="Financial" value={aiData?.scores?.financial_score} />
                <ScoreBar label="Faculty" value={aiData?.scores?.faculty_score} />
                <ScoreBar label="Infrastructure" value={aiData?.scores?.infra_score} />
                <ScoreBar label="Visual Content" value={aiData?.scores?.visual_score} />
              </div>
            </div>

            {/* VISUAL DETECTION */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <ImageIcon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Visual Detection</h3>
                  <p className="text-sm text-gray-500">AI-powered image analysis</p>
                </div>
              </div>
              <div className="space-y-4">
                <VisualStatus label="Classroom Facilities" status={aiData?.visual_detection?.Classroom} />
                <VisualStatus label="Library Resources" status={aiData?.visual_detection?.Library} />
                <VisualStatus label="Laboratory Equipment" status={aiData?.visual_detection?.Laboratory} />
                <VisualStatus label="Campus Infrastructure" status={aiData?.visual_detection?.College_Building} />
              </div>
            </div>

            {/* AI DECISION */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI Final Decision</h3>
                  <p className="text-sm text-gray-500">Automated evaluation summary</p>
                </div>
              </div>
              <div className={`p-4 rounded-lg ${
                aiData?.final_decision?.status === "approved" 
                  ? "bg-emerald-50 border border-emerald-200" 
                  : aiData?.final_decision?.status === "rejected"
                  ? "bg-rose-50 border border-rose-200"
                  : "bg-amber-50 border border-amber-200"
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold">
                    {aiData?.final_decision?.status?.toUpperCase() || "PENDING"}
                  </span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    aiData?.final_decision?.status === "approved" 
                      ? "bg-emerald-100 text-emerald-700" 
                      : aiData?.final_decision?.status === "rejected"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {aiData?.final_decision?.confidence || "N/A"} confidence
                  </span>
                </div>
                <div className="space-y-2">
                  {aiData?.final_decision?.reasons?.map((reason, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionDashboard;

/* ========== SUBCOMPONENTS ========== */

const MetricCard = ({ title, value, change, icon, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600"
  };

  return (
    <div className="bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        {change && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            change.startsWith("+") 
              ? "bg-emerald-50 text-emerald-700" 
              : "bg-rose-50 text-rose-700"
          }`}>
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
  );
};

const DetailCard = ({ label, items }) => (
  <div className="border rounded-lg p-4">
    <h4 className="font-medium text-xl text-gray-900 mb-3">{label}</h4>
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="flex flex-col">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            {item.icon && item.icon}
            <span>{item.label}</span>
          </div>
          <p className="font-medium">{item.value || "Not provided"}</p>
        </div>
      ))}
    </div>
  </div>
);

const ScoreBar = ({ label, value = 0 }) => (
  <div>
    <div className="flex justify-between text-sm mb-1.5">
      <span>{label}</span>
      <span className="font-medium">{value}%</span>
    </div>
    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const VisualStatus = ({ label, status }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-sm text-gray-700">{label}</span>
    <div className="flex items-center gap-2">
      {status === "present" ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-sm font-medium text-emerald-600">Present</span>
        </>
      ) : (
        <>
          <div className="w-2 h-2 rounded-full bg-rose-500" />
          <span className="text-sm font-medium text-rose-600">Missing</span>
        </>
      )}
    </div>
  </div>
);