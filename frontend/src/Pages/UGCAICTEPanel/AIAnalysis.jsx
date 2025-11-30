import React from "react";
import UGCLayout from "../../Components/UGCLayout";
import { AlertTriangle, Brain, FileDown, BarChart3 } from "lucide-react";

const AIAnalysis = () => {
  return (
    <UGCLayout showNavbar={false}>
      <div className="p-6 space-y-10">

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-gray-800">AI Analysis & Reports</h1>

        {/* AI GENERATED RISK ALERTS */}
        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
            <AlertTriangle className="text-red-500" /> AI-Generated Risk Alerts
          </h2>

          <div className="mt-4 space-y-3">
            <div className="p-4 bg-red-100 text-red-700 rounded-lg">
              ⚠️ Sudden drop in Placement % (13% lower than last year)
            </div>

            <div className="p-4 bg-yellow-100 text-yellow-700 rounded-lg">
              ⚠️ Missing Lab Equipment Data for 2 departments
            </div>

            <div className="p-4 bg-blue-100 text-blue-700 rounded-lg">
              ℹ️ Faculty-Student Ratio close to minimum threshold
            </div>
          </div>
        </section>

        {/* AI VS HUMAN COMPARISON */}
        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
            <Brain className="text-indigo-500" /> Comparison: Human Review vs AI Review
          </h2>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="p-5 bg-gray-100 rounded-lg text-center">
              <p className="text-gray-600 text-sm">Human Review Score</p>
              <p className="text-4xl font-bold text-gray-800 mt-2">86%</p>
            </div>

            <div className="p-5 bg-gray-100 rounded-lg text-center">
              <p className="text-gray-600 text-sm">AI Review Score</p>
              <p className="text-4xl font-bold text-indigo-600 mt-2">82%</p>
            </div>

            <div className="p-5 bg-gray-100 rounded-lg text-center">
              <p className="text-gray-600 text-sm">Accuracy Match</p>
              <p className="text-4xl font-bold text-green-600 mt-2">94%</p>
            </div>

          </div>

          <div className="mt-6">
            <BarChart3 className="text-indigo-600" />
            <p className="mt-2 text-gray-600">
              AI identified 2 potential mismatches in the submitted data.
            </p>
          </div>
        </section>

        {/* DOWNLOADABLE REPORTS */}
        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
            <FileDown className="text-green-600" /> Download Institutional Reports
          </h2>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">

            <button className="flex items-center justify-between w-full p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
              <span>AI Summary Report</span>
              <FileDown />
            </button>

            <button className="flex items-center justify-between w-full p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
              <span>Human Review Report</span>
              <FileDown />
            </button>

            <button className="flex items-center justify-between w-full p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
              <span>Combined Verification Report</span>
              <FileDown />
            </button>

          </div>
        </section>

      </div>
    </UGCLayout>
  );
};

export default AIAnalysis;
