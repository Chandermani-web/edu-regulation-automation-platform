import React from "react";
import Sidebar from "../../Components/Sidebar";
import { Bot, AlertTriangle, CheckCircle, Info, TrendingUp, FileDown } from "lucide-react";

const AIAnalytics = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="w-full p-10 space-y-10">

        {/* PAGE TITLE */}
        <h1 className="text-3xl font-bold">AI Analytics</h1>
        <p className="text-gray-600">AI-based evaluation of your institution data, documents, and compliance.</p>

        {/* AI SCORE CARD */}
        <div className="bg-white shadow-xl rounded-xl p-6 border-l-8 border-purple-600">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Bot className="text-purple-600" /> AI Score
          </h2>

          <p className="text-5xl font-extrabold text-green-600 mt-3">86%</p>
          <p className="text-gray-600 mt-2">
            The AI score is based on consistency of documents, parameters, data accuracy, and compliance rules.
          </p>
        </div>

        {/* SECTION-WISE AI SCORE */}
        <div className="grid grid-cols-4 gap-6">
          {[
            { title: "Documents", score: 92 },
            { title: "Parameters", score: 78 },
            { title: "Infrastructure", score: 81 },
            { title: "Faculty", score: 65 }
          ].map((item, index) => (
            <div key={index} className="bg-white shadow rounded-xl p-4 text-center">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">{item.score}%</p>
            </div>
          ))}
        </div>

        {/* DATA CONSISTENCY CHECK */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Data Consistency Check</h2>

          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center gap-2"><CheckCircle className="text-green-600" /> Student strength matches enrollment report.</li>
            <li className="flex items-center gap-2"><CheckCircle className="text-green-600" /> Faculty count consistent across documents.</li>
            <li className="flex items-center gap-2"><AlertTriangle className="text-red-500" /> Lab area mismatch detected (AI flagged).</li>
            <li className="flex items-center gap-2"><CheckCircle className="text-green-600" /> Financial audit records are consistent.</li>
          </ul>
        </div>


        {/* RED FLAG ALERTS */}
        <div className="bg-white shadow rounded-xl p-6 border-l-8 border-red-500">
          <h2 className="text-xl font-semibold text-red-600 flex items-center gap-2">
            <AlertTriangle /> AI Alerts (Critical Issues)
          </h2>

          <div className="mt-4 space-y-3">
            <p className="bg-red-100 p-3 rounded-lg">
              ⚠️ <b>Infrastructure mismatch:</b> Document shows 3500 sq ft, parameter says 1500 sq ft.
            </p>
            <p className="bg-yellow-100 p-3 rounded-lg">
              ⚠️ <b>Faculty mismatch:</b> 2 PhDs required, document shows only 1.
            </p>
            <p className="bg-blue-100 p-3 rounded-lg">
              ℹ️ <b>Research output low:</b> Only 2 publications in last 3 years.
            </p>
          </div>
        </div>

        {/* AI CROSS-CHECK TABLE */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Document–Parameter Cross Check</h2>

          <table className="w-full border">
            <thead className="bg-gray-200 font-semibold">
              <tr>
                <td className="p-3">Category</td>
                <td className="p-3">Parameter Value</td>
                <td className="p-3">Document Value</td>
                <td className="p-3">Status</td>
              </tr>
            </thead>

            <tbody>
              <tr className="border">
                <td className="p-3">Lab Area</td>
                <td className="p-3">1500 sq ft</td>
                <td className="p-3">3500 sq ft</td>
                <td className="p-3 text-red-500 font-semibold">Mismatch</td>
              </tr>
              <tr className="border">
                <td className="p-3">Faculty PhD Count</td>
                <td className="p-3">2</td>
                <td className="p-3">1</td>
                <td className="p-3 text-yellow-600 font-semibold">Partial Match</td>
              </tr>
            </tbody>
          </table>
        </div>


        {/* HISTORICAL TREND */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="text-blue-600" /> AI Trend (Last 3 Years)
          </h2>

          <div className="bg-gray-100 h-48 rounded-lg mt-4 flex items-center justify-center">
            📊 <span className="ml-2">Chart Placeholder – will integrate once backend provides data</span>
          </div>
        </div>

        {/* AI SUGGESTIONS */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">AI Improvement Suggestions</h2>

          <ul className="space-y-3 text-gray-700">
            <li>• Upload missing lab area documentation.</li>
            <li>• Upload latest faculty qualification certificates.</li>
            <li>• Add research publications for the last 3 years.</li>
            <li>• Verify hostel capacity and upload supporting documents.</li>
          </ul>
        </div>

        {/* DOWNLOAD REPORT */}
        <button className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-lg flex items-center gap-2">
          <FileDown /> Download Full AI Report (PDF)
        </button>

      </div>
    </div>
  );
};

export default AIAnalytics;
