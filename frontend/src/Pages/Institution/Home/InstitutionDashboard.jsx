import React from "react";
import Layout from "../../../Components/Layout";
import {
  FileCheck,
  CheckCircle,
  XCircle,
  Clock,
  MessagesSquare,
  Bot,
  Building2,
  Users,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  Download,
  Eye,
  Calendar,
  MapPin,
  Mail,
  Phone
} from "lucide-react";

const InstitutionDashboard = () => {
  // Sample data
  const institutionData = {
    name: "Example Institute of Technology",
    code: "INST2301",
    type: "Private",
    address: "123 Knowledge Road, Educational District",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302020",
    email: "principal@eit.ac.in",
    phone: "+91 9876543210",
    established: "2005",
    accreditation: "NAAC 'A' Grade",
    principal: "Dr. Rajesh Sharma"
  };

  const stats = {
    totalApplications: 5,
    approved: 2,
    pending: 3,
    rejected: 1,
    activeQueries: 1,
    documentsUploaded: 25,
    totalDocuments: 30,
    aiScore: 86
  };

  const recentApplications = [
    { id: "APP-2024-001", type: "New Institution", status: "Approved", date: "2024-01-15", progress: 100 },
    { id: "APP-2024-002", type: "Course Addition", status: "Pending", date: "2024-01-20", progress: 75 },
    { id: "APP-2024-003", type: "Infrastructure", status: "In Review", date: "2024-01-25", progress: 60 },
    { id: "APP-2024-004", type: "Faculty Update", status: "Rejected", date: "2024-01-28", progress: 100 }
  ];

  const pendingActions = [
    { task: "Upload remaining documents", deadline: "2024-02-15", priority: "High" },
    { task: "Submit quarterly report", deadline: "2024-02-28", priority: "Medium" },
    { task: "Faculty qualification verification", deadline: "2024-03-10", priority: "High" }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved": return "text-green-600 bg-green-50 border-green-200";
      case "Pending": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "In Review": return "text-blue-600 bg-blue-50 border-blue-200";
      case "Rejected": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "text-red-600 bg-red-50 border-red-200";
      case "Medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Low": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* HEADER SECTION */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Institution Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back, {institutionData.name}. Here's your application overview and status updates.
            </p>
          </div>

          {/* QUICK STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-700 font-medium">Total Applications</h3>
                <FileCheck className="text-blue-600" size={20} />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
              <p className="text-sm text-gray-500 mt-1">All time submissions</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-700 font-medium flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  Approved
                </h3>
              </div>
              <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
              <p className="text-sm text-gray-500 mt-1">Successfully processed</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-700 font-medium flex items-center gap-2">
                  <Clock size={16} className="text-yellow-500" />
                  Pending
                </h3>
              </div>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-sm text-gray-500 mt-1">Under review</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-700 font-medium flex items-center gap-2">
                  <XCircle size={16} className="text-red-500" />
                  Rejected
                </h3>
              </div>
              <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
              <p className="text-sm text-gray-500 mt-1">Requires attention</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-700 font-medium flex items-center gap-2">
                  <MessagesSquare size={16} className="text-blue-500" />
                  Active Queries
                </h3>
              </div>
              <p className="text-3xl font-bold text-blue-600">{stats.activeQueries}</p>
              <p className="text-sm text-gray-500 mt-1">Requires response</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-8">
              {/* INSTITUTION PROFILE CARD */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                    <Building2 className="text-blue-600" size={24} />
                    Institution Profile
                  </h2>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Edit Profile
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Institution Name</label>
                      <p className="text-gray-900 font-medium">{institutionData.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Institution Code</label>
                      <p className="text-gray-900 font-medium">{institutionData.code}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Type</label>
                      <p className="text-gray-900 font-medium">{institutionData.type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Established</label>
                      <p className="text-gray-900 font-medium">{institutionData.established}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <MapPin size={14} />
                        Address
                      </label>
                      <p className="text-gray-900">{institutionData.address}</p>
                      <p className="text-gray-600 text-sm">{institutionData.city}, {institutionData.state} - {institutionData.pincode}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <Mail size={14} />
                        Email
                      </label>
                      <p className="text-gray-900">{institutionData.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <Phone size={14} />
                        Phone
                      </label>
                      <p className="text-gray-900">{institutionData.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Principal/Director</label>
                      <p className="text-gray-900 font-medium">{institutionData.principal}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Accreditation</label>
                      <p className="text-gray-900 font-medium">{institutionData.accreditation}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RECENT APPLICATIONS */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                    <FileCheck className="text-green-600" size={24} />
                    Recent Applications
                  </h2>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View All
                  </button>
                </div>

                <div className="space-y-4">
                  {recentApplications.map((app, index) => (
                    <div key={app.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{app.type}</h4>
                          <p className="text-sm text-gray-500">{app.id} • {app.date}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-24">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{app.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                app.progress === 100 ? "bg-green-500" : "bg-blue-500"
                              }`}
                              style={{ width: `${app.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                            <Eye size={16} />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                            <Download size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-8">
              {/* DOCUMENT STATUS */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3 mb-6">
                  <FileCheck className="text-purple-600" size={24} />
                  Document Status
                </h2>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold text-gray-900">
                      Upload Progress
                    </span>
                    <span className="text-gray-600">
                      {stats.documentsUploaded}/{stats.totalDocuments}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(stats.documentsUploaded / stats.totalDocuments) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {stats.totalDocuments - stats.documentsUploaded} documents pending upload
                  </p>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors">
                  Upload Documents
                </button>
              </div>

              {/* PENDING ACTIONS */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3 mb-6">
                  <AlertTriangle className="text-orange-500" size={24} />
                  Pending Actions
                </h2>

                <div className="space-y-4">
                  {pendingActions.map((action, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{action.task}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(action.priority)}`}>
                          {action.priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={14} />
                        Deadline: {action.deadline}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI SCORE CARD */}
              <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white rounded-xl shadow-lg p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Bot className="text-yellow-300" size={24} />
                  <h3 className="text-lg font-semibold">AI Compliance Score</h3>
                </div>
                
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 rounded-full border-4 border-blue-400 flex items-center justify-center">
                    <span className="text-3xl font-bold">{stats.aiScore}%</span>
                  </div>
                  <TrendingUp className="absolute -top-2 -right-2 text-green-300" size={20} />
                </div>
                
                <p className="text-blue-100 text-sm">
                  Your institution meets {stats.aiScore}% of compliance requirements
                </p>
                <button className="mt-4 w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg font-medium transition-colors backdrop-blur-sm">
                  View Detailed Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionDashboard;