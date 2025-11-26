import React from "react";
import Sidebar from "../../Components/Sidebar";
import { FileText, FileCheck, AlertTriangle, BarChart, Eye, Download, History } from "lucide-react";

const AIReports = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="w-full p-10 space-y-10">
        
        {/* PAGE TITLE */}
        <h1 className="text-3xl font-bold">AI Generated Reports</h1>
        <p className="text-gray-600">Download AI-generated compliance and verification reports.</p>

        {/* REPORT CARDS WRAPPER */}
        <div className="grid grid-cols-2 gap-6">

          {/* SUMMARY REPORT */}
          <ReportCard
            title="Summary AI Compliance Report"
            desc="Overall AI-computed compliance score, performance summary, and evaluation."
            icon={<FileText className="text-blue-600" />}
            status="Generated"
            updated="12 Feb 2025"
          />

          {/* DETAILED REPORT */}
          <ReportCard
            title="Detailed Compliance Report"
            desc="Deep analysis of parameters, faculty, infrastructure, and documentation."
            icon={<BarChart className="text-purple-700" />}
            status="Generated"
            updated="12 Feb 2025"
          />

          {/* INCONSISTENCY REPORT */}
          <ReportCard
            title="Parameter Inconsistency Report"
            desc="AI-detected mismatches between submitted parameters and documents."
            icon={<AlertTriangle className="text-red-600" />}
            status="Generated"
            updated="11 Feb 2025"
          />

          {/* DOC VERIFICATION REPORT */}
          <ReportCard
            title="Document Verification Report"
            desc="List of verified, invalid, mismatched, or missing documents."
            icon={<FileCheck className="text-green-600" />}
            status="Generated"
            updated="11 Feb 2025"
          />

          {/* RISK REPORT */}
          <ReportCard
            title="AI Risk Analysis Report"
            desc="AI evaluation of risk, compliance failure probability & red-flag areas."
            icon={<AlertTriangle className="text-yellow-500" />}
            status="Generated"
            updated="10 Feb 2025"
          />
        </div>

        {/* PREVIEW SECTION */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Eye /> PDF Preview
          </h2>

          <div className="bg-gray-100 h-80 mt-4 rounded-lg flex justify-center items-center">
            <p className="text-gray-500">PDF preview will load here after backend integration.</p>
          </div>
        </div>

        {/* HISTORY SECTION */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <History /> Report History
          </h2>

          <p className="text-gray-600 mt-2">View and download past generated reports.</p>

          <table className="w-full mt-4 border">
            <thead className="bg-gray-200 font-semibold">
              <tr>
                <td className="p-3">Report</td>
                <td className="p-3">Generated On</td>
                <td className="p-3">Version</td>
                <td className="p-3">Action</td>
              </tr>
            </thead>

            <tbody>
              <tr className="border">
                <td className="p-3">Summary AI Compliance Report</td>
                <td className="p-3">10 Jan 2025</td>
                <td className="p-3">v1.2</td>
                <td className="p-3 flex gap-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-1">
                    <Download size={16}/> PDF
                  </button>
                </td>
              </tr>

              <tr className="border">
                <td className="p-3">Document Verification Report</td>
                <td className="p-3">05 Jan 2025</td>
                <td className="p-3">v1.1</td>
                <td className="p-3 flex gap-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-1">
                    <Download size={16}/> PDF
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

        </div>

      </div>
    </div>
  );
};

/* REUSABLE REPORT CARD COMPONENT */
const ReportCard = ({ title, desc, icon, status, updated }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col justify-between">

      <div className="flex items-start gap-4">
        <div className="text-4xl">{icon}</div>
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-gray-600 mt-2">{desc}</p>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-500">Updated: {updated}</span>

        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
            <Download size={18}/> Download
          </button>

          <button className="px-4 py-2 border rounded-lg hover:bg-gray-100 flex items-center gap-1">
            <Eye size={18}/> Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIReports;
