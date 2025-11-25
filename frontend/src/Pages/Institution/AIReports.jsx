import React from "react";
import Sidebar from "../../Components/Sidebar";

const AIReports = () => {
  const reports = [
    {
      id: 1,
      title: "Summary AI Compliance Report",
      description: "AI-generated summary of institution compliance score and overall evaluation.",
      file: "/reports/summary-report.pdf",
    },
    {
      id: 2,
      title: "Detailed Compliance Report",
      description: "Deep analysis of parameters, faculty data, infrastructure, and documentation.",
      file: "/reports/compliance-report.pdf",
    },
    {
      id: 3,
      title: "Parameter Inconsistency Report",
      description: "AI-flagged inconsistencies between parameters and documents.",
      file: "/reports/inconsistency-report.pdf",
    },
    {
      id: 4,
      title: "Document Verification Report",
      description: "List of verified, missing, invalid, or mismatched documents.",
      file: "/reports/document-verification.pdf",
    },
    {
      id: 5,
      title: "AI Risk Analysis Report",
      description: "AI-generated risk scores and red-flag sections needing improvement.",
      file: "/reports/risk-analysis.pdf",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-col w-full p-8">

        <h1 className="text-2xl font-bold mb-6">AI Generated Reports</h1>
        <p className="text-gray-600 mb-6">
          Below are all AI-generated analysis reports based on your institution's data.
        </p>

        {/* REPORT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {reports.map((report) => (
            <div key={report.id} className="bg-white p-6 shadow rounded border">

              <h2 className="text-xl font-semibold">{report.title}</h2>
              <p className="text-gray-600 text-sm mt-2">{report.description}</p>

              <div className="flex justify-between items-center mt-4">
                <button
                  className="bg-blue-600 text-white px-5 py-2 rounded font-semibold"
                >
                  Download
                </button>

                <button
                  className="border px-5 py-2 rounded font-semibold hover:bg-gray-100"
                >
                  Preview
                </button>
              </div>

            </div>
          ))}

        </div>

        {/* PDF PREVIEW PLACEHOLDER */}
        <div className="bg-white mt-10 p-6 shadow rounded border">
          <h2 className="text-lg font-semibold mb-3">PDF Preview</h2>
          <div className="bg-gray-100 h-64 rounded flex items-center justify-center text-gray-500">
            PDF preview will load here after backend integration.
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIReports;
