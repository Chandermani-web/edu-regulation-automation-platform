import React, { useContext, useMemo } from "react";
import StepProgress from "../../../Components/StepProgress";
import { AlertTriangle, CheckCircle, Bot } from "lucide-react";
import AppContext from "../../../Context/UseContext";

const AIAnalyticsDashboard = () => {
  const { institutionDetails } = useContext(AppContext);

  // Get latest AI analysis
  const analysis = useMemo(() => {
    if (!institutionDetails?.ai_analysis?.length) return null;
    return institutionDetails.ai_analysis[institutionDetails.ai_analysis.length - 1];
  }, [institutionDetails]);

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        No AI Analysis available yet
      </div>
    );
  }

  const {
    scores,
    visual_detection,
    final_decision,
    ai_total_score
  } = analysis;

  /* ---------------- SECTION SCORES ---------------- */
  const sectionScores = [
    { title: "Financial", score: scores?.financial_score || 0 },
    { title: "Faculty", score: scores?.faculty_score || 0 },
    { title: "Infrastructure", score: scores?.infra_score || 0 },
    { title: "Visual", score: scores?.visual_score || 0 }
  ];

  /* ---------------- CONSISTENCY CHECKS ---------------- */
  const consistencyChecks = Object.entries(visual_detection || {}).map(
    ([key, value]) => ({
      check: `${key} availability`,
      status: value === "present" ? "pass" : "fail",
    })
  );

  /* ---------------- ALERTS ---------------- */
  const alerts = (final_decision?.reasons || []).map((reason) => ({
    type: final_decision.status === "Rejected" ? "critical" : "warning",
    message: reason,
  }));

  /* ---------------- CROSS CHECK TABLE ---------------- */
  const crossChecks = Object.entries(visual_detection || {}).map(
    ([key, value]) => ({
      category: key,
      parameter: "Required",
      document: value === "present" ? "Provided" : "Missing",
      status: value === "present" ? "pass" : "mismatch",
    })
  );

  /* ---------------- SUGGESTIONS ---------------- */
  const suggestions = Object.entries(visual_detection || {})
    .filter(([_, value]) => value === "missing")
    .map(([key]) => `Upload or verify image for ${key}`);

  const getAlertColor = (type) => {
    switch (type) {
      case "critical":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pass":
        return "text-green-600";
      case "fail":
      case "mismatch":
        return "text-red-600";
      case "partial":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-start gap-8">
      <StepProgress currentStep={5} />

      <div className="max-w-7xl w-full">
        {/* HEADER */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time AI evaluation for {institutionDetails?.name}
          </p>
        </div>

        {/* SCORE + SECTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Overall Score */}
          <div className="bg-white rounded-xl shadow border p-6 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Bot className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold">AI Compliance Score</h2>
                <p className="text-sm text-gray-600">System-generated score</p>
              </div>
            </div>

            <div className="text-center">
              <div className="text-6xl font-bold text-green-600 mb-2">
                {ai_total_score || scores?.total_score || 0}%
              </div>
              <p className="text-gray-600">
                Final Decision:{" "}
                <span className="font-semibold">
                  {final_decision?.status}
                </span>
              </p>
            </div>
          </div>

          {/* Section Scores */}
          <div className="bg-white rounded-xl shadow border p-6">
            <h3 className="text-lg font-semibold mb-4">Section Scores</h3>
            <div className="space-y-4">
              {sectionScores.map((section, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="font-medium">{section.title}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 h-2 rounded-full">
                      <div
                        className={`h-2 rounded-full ${
                          section.score >= 80
                            ? "bg-green-500"
                            : section.score >= 60
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${section.score}%` }}
                      />
                    </div>
                    <span className="font-bold text-sm">
                      {section.score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ALERTS + CONSISTENCY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Alerts */}
          <div className="bg-white p-6 rounded-xl border shadow">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="text-red-500" />
              System Alerts
            </h3>

            {alerts.length === 0 ? (
              <p className="text-green-600">No critical issue found ✅</p>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`p-3 border rounded-lg ${getAlertColor(
                      alert.type
                    )}`}
                  >
                    {alert.message}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Consistency */}
          <div className="bg-white p-6 rounded-xl border shadow">
            <h3 className="text-lg font-semibold mb-4">
              Visual Consistency Check
            </h3>

            {consistencyChecks.map((check, index) => (
              <div
                key={index}
                className="flex justify-between items-center"
              >
                <span>{check.check}</span>
                {check.status === "pass" ? (
                  <CheckCircle className="text-green-500" />
                ) : (
                  <AlertTriangle className="text-red-500" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CROSS CHECK TABLE */}
        <div className="bg-white p-6 rounded-xl border shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">
            AI Cross Verification
          </h3>

          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Category</th>
                <th className="p-3">Requirement</th>
                <th className="p-3">Result</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {crossChecks.map((item, index) => (
                <tr key={index}>
                  <td className="p-3">{item.category}</td>
                  <td className="p-3">{item.parameter}</td>
                  <td className="p-3">{item.document}</td>
                  <td
                    className={`p-3 font-semibold ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status.toUpperCase()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SUGGESTIONS */}
        <div className="bg-white p-6 rounded-xl border shadow">
          <h3 className="text-lg font-semibold mb-4">
            AI Auto Suggestions
          </h3>

          {suggestions.length === 0 ? (
            <p className="text-green-600">
              No suggestions — everything is perfect ✅
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {suggestions.map((item, index) => (
                <div
                  key={index}
                  className="p-3 bg-blue-50 rounded-lg flex gap-2"
                >
                  <CheckCircle className="text-blue-600" size={16} />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAnalyticsDashboard;
