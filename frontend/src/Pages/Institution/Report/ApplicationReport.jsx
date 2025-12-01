import React, { useState } from "react";
import Layout from "../../../Components/Layout";
import StepProgress from "../../../Components/StepProgress";
import {
  Bot,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  FileDown,
  FileText,
  BarChart,
  Eye,
  Download,
  History,
  MessageCircle,
  Send,
  User,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";

const AIAnalyticsAndReports = () => {
  const [activeTab, setActiveTab] = useState("analytics");
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: "ai",
      message: "Hello! I'm your AI Assistant. I can help you understand your analytics report and answer questions about compliance requirements.",
      timestamp: new Date().toISOString()
    }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const analyticsData = {
    overallScore: 86,
    sectionScores: [
      { title: "Documents", score: 92 },
      { title: "Parameters", score: 78 },
      { title: "Infrastructure", score: 81 },
      { title: "Faculty", score: 65 },
    ],
    consistencyChecks: [
      { check: "Student strength matches enrollment report", status: "pass" },
      { check: "Faculty count consistent across documents", status: "pass" },
      { check: "Lab area mismatch detected", status: "fail" },
      { check: "Financial audit records are consistent", status: "pass" },
    ],
    alerts: [
      { type: "critical", message: "Infrastructure mismatch: Document shows 3500 sq ft, parameter says 1500 sq ft" },
      { type: "warning", message: "Faculty mismatch: 2 PhDs required, document shows only 1" },
      { type: "info", message: "Research output low: Only 2 publications in last 3 years" },
    ],
    crossChecks: [
      { category: "Lab Area", parameter: "1500 sq ft", document: "3500 sq ft", status: "mismatch" },
      { category: "Faculty PhD Count", parameter: "2", document: "1", status: "partial" },
    ],
    suggestions: [
      "Upload missing lab area documentation",
      "Upload latest faculty qualification certificates",
      "Add research publications for the last 3 years",
      "Verify hostel capacity and upload supporting documents",
    ]
  };

  const reports = [
    {
      id: 1,
      title: "Summary AI Compliance Report",
      description: "Overall AI-computed compliance score, performance summary, and evaluation.",
      icon: <FileText className="text-blue-600" />,
      status: "Generated",
      updated: "12 Feb 2025",
      version: "v1.3"
    },
    {
      id: 2,
      title: "Detailed Compliance Report",
      description: "Deep analysis of parameters, faculty, infrastructure, and documentation.",
      icon: <BarChart className="text-purple-700" />,
      status: "Generated",
      updated: "12 Feb 2025",
      version: "v1.2"
    },
    {
      id: 3,
      title: "Parameter Inconsistency Report",
      description: "AI-detected mismatches between submitted parameters and documents.",
      icon: <AlertTriangle className="text-red-600" />,
      status: "Generated",
      updated: "11 Feb 2025",
      version: "v1.1"
    },
    {
      id: 4,
      title: "Document Verification Report",
      description: "List of verified, invalid, mismatched, or missing documents.",
      icon: <CheckCircle className="text-green-600" />,
      status: "Generated",
      updated: "11 Feb 2025",
      version: "v1.2"
    }
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: chatMessages.length + 1,
      type: "user",
      message: newMessage,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: chatMessages.length + 2,
        type: "ai",
        message: "I understand your question about the compliance report. Based on my analysis, the main issue is with infrastructure documentation. Would you like me to provide specific recommendations?",
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const getAlertColor = (type) => {
    switch (type) {
      case "critical": return "bg-red-50 border-red-200 text-red-800";
      case "warning": return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "info": return "bg-blue-50 border-blue-200 text-blue-800";
      default: return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pass": return "text-green-600";
      case "fail": return "text-red-600";
      case "partial": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-start gap-8">
      <StepProgress currentStep={5} />

      <div className="max-w-7xl w-full">
        {/* HEADER SECTION */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Analytics & Reports</h1>
              <p className="text-gray-600">
                Comprehensive AI-powered analysis of your institution's compliance and performance metrics
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Last updated:</span>
              <span className="text-sm font-medium text-gray-700">12 Feb 2025</span>
            </div>
          </div>

          {/* TAB NAVIGATION */}
          <div className="flex border-b border-gray-200 mt-6">
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === "analytics"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Analytics Dashboard
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === "reports"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Generated Reports
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === "chat"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              AI Assistant
            </button>
          </div>
        </div>

        {/* ANALYTICS TAB */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* AI SCORE OVERVIEW */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <Bot className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">AI Compliance Score</h2>
                    <p className="text-gray-600 text-sm">Overall institution compliance rating</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-bold text-green-600 mb-2">{analyticsData.overallScore}%</div>
                  <p className="text-gray-600">
                    Based on document consistency, parameter accuracy, and regulatory compliance
                  </p>
                </div>
              </div>

              {/* SECTION SCORES */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Section Scores</h3>
                <div className="space-y-4">
                  {analyticsData.sectionScores.map((section, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">{section.title}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              section.score >= 80 ? "bg-green-500" : 
                              section.score >= 60 ? "bg-yellow-500" : "bg-red-500"
                            }`}
                            style={{ width: `${section.score}%` }}
                          ></div>
                        </div>
                        <span className={`font-bold text-sm ${
                          section.score >= 80 ? "text-green-600" : 
                          section.score >= 60 ? "text-yellow-600" : "text-red-600"
                        }`}>
                          {section.score}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ALERTS AND CONSISTENCY */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* ALERTS */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="text-red-500" />
                  Critical Alerts
                </h3>
                <div className="space-y-3">
                  {analyticsData.alerts.map((alert, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}>
                      <div className="flex items-start gap-2">
                        {alert.type === "critical" && <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />}
                        {alert.type === "warning" && <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />}
                        {alert.type === "info" && <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />}
                        <span className="text-sm">{alert.message}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CONSISTENCY CHECKS */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Consistency</h3>
                <div className="space-y-3">
                  {analyticsData.consistencyChecks.map((check, index) => (
                    <div key={index} className="flex items-center justify-between p-2">
                      <span className="text-gray-700">{check.check}</span>
                      {check.status === "pass" ? (
                        <CheckCircle className="text-green-500" size={20} />
                      ) : (
                        <AlertTriangle className="text-red-500" size={20} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CROSS-CHECK TABLE */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Parameter-Document Cross Check</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Parameter Value</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Document Value</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {analyticsData.crossChecks.map((check, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900">{check.category}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{check.parameter}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{check.document}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`font-medium ${getStatusColor(check.status)}`}>
                            {check.status === "mismatch" ? "Mismatch" : "Partial Match"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* IMPROVEMENT SUGGESTIONS */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Improvement Suggestions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analyticsData.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
                    <span className="text-sm text-blue-800">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            {/* REPORT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reports.map((report) => (
                <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {report.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.title}</h3>
                      <p className="text-gray-600 text-sm">{report.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Updated: {report.updated} • {report.version}
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                        <Download size={16} />
                        Download
                      </button>
                      <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                        <Eye size={16} />
                        Preview
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* REPORT HISTORY */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <History />
                Report History
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Report</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Generated On</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Version</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reports.map((report) => (
                      <tr key={report.id}>
                        <td className="px-4 py-3 text-sm text-gray-900">{report.title}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{report.updated}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{report.version}</td>
                        <td className="px-4 py-3">
                          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors flex items-center gap-1">
                            <Download size={14} />
                            PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CHAT TAB */}
        {activeTab === "chat" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* CHAT HEADER */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">AI Compliance Assistant</h3>
                  <p className="text-blue-100 text-sm">Ask me anything about your analytics and reports</p>
                </div>
              </div>
            </div>

            {/* CHAT MESSAGES */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.type === "ai" && (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot size={16} className="text-blue-600" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] rounded-2xl p-4 ${
                      msg.type === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <div className={`text-xs mt-2 ${
                      msg.type === "user" ? "text-blue-200" : "text-gray-500"
                    }`}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  {msg.type === "user" && (
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User size={16} className="text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CHAT INPUT */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask about your compliance report..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send size={18} />
                  Send
                </button>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
                  <ThumbsUp size={14} />
                  Helpful
                </button>
                <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
                  <ThumbsDown size={14} />
                  Not Helpful
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DOWNLOAD BUTTON */}
        <div className="flex justify-end mt-6">
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-sm">
            <FileDown size={20} />
            Download Complete Analysis Package
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAnalyticsAndReports;