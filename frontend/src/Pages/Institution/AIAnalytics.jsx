import React from "react";
import Sidebar from "../../Components/Sidebar";

const AIAnalytics = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex flex-col w-full p-8">

        <h1 className="text-2xl font-bold mb-6">AI Analytics</h1>
        <p className="text-gray-600 mb-6">
          AI-based evaluation of your institution data, documents, and compliance score.
        </p>

        {/* AI Score */}
        <div className="bg-white shadow rounded-xl p-6 mb-6 border">
          <h2 className="text-xl font-semibold text-purple-700 mb-2">AI Score</h2>
          <p className="text-4xl font-bold text-green-600">86%</p>
          <p className="text-gray-600 mt-2 text-sm">
            AI-calculated compliance score based on documents, parameters and historical consistency.
          </p>
        </div>

        {/* Consistency Analysis */}
        <div className="bg-white shadow rounded-xl p-6 mb-6 border">
          <h2 className="text-xl font-semibold mb-4">Data Consistency Check</h2>

          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li>📘 Student strength matches enrollment report.</li>
            <li>📚 Faculty count consistent across documents.</li>
            <li>🏫 Infrastructure lab area mismatch detected (AI flagged).</li>
            <li>📄 Financial data consistent with audit report.</li>
          </ul>
        </div>

        {/* Alerts Section */}
        <div className="bg-white shadow rounded-xl p-6 mb-6 border">
          <h2 className="text-xl font-semibold text-red-600 mb-4">AI Alerts</h2>

          <ul className="space-y-3">
            <li className="bg-red-100 p-3 rounded">
              ⚠️ **Infrastructure area mismatch:** Document says 3500 sq ft, parameter says 1500 sq ft.
            </li>

            <li className="bg-yellow-100 p-3 rounded">
              ⚠️ **Faculty qualification mismatch:** 2 faculty marked PhD, document shows 1 PhD.
            </li>

            <li className="bg-blue-100 p-3 rounded">
              ℹ️ **Research Data Low:** Only 2 publications in the last 3 years.
            </li>
          </ul>
        </div>

        {/* Charts Area */}
        <div className="bg-white shadow rounded-xl p-6 mb-6 border">
          <h2 className="text-xl font-semibold mb-4">AI Summary Charts</h2>

          <div className="h-40 bg-gray-100 rounded flex items-center justify-center text-gray-500">
            📊 Chart Placeholder (Frontend Only)  
            <br />
            Will integrate real charts when backend sends analytics.
          </div>
        </div>

        {/* Improvement Suggestions */}
        <div className="bg-white shadow rounded-xl p-6 mb-10 border">
          <h2 className="text-xl font-semibold mb-4">AI Improvement Suggestions</h2>

          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li>Add missing lab area documentation.</li>
            <li>Upload latest faculty qualification certificates.</li>
            <li>Fill research publications for the last 3 years.</li>
            <li>Verify hostel capacity details and upload proof documents.</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default AIAnalytics;
