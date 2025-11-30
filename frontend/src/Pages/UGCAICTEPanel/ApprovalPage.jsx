import React from "react";
import UGCLayout from "../../Components/UGCLayout";
import { CheckCircle, XCircle, Undo2, FileText } from "lucide-react";

const ApprovalPage = () => {
  return (
    <UGCLayout showNavbar={false}>
      <div className="p-6 space-y-8">

        {/* PAGE TITLE */}
        <h1 className="text-2xl font-bold text-gray-800">Final Approval</h1>

        {/* REVIEW SUMMARY */}
        <section className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Review Summary</h2>

          <p className="text-gray-600">
            Before giving final approval, please verify that all sections—
            parameters, documents, AI analysis, and committee reviews—are completed.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">

            <div className="p-4 bg-green-100 rounded-lg text-green-700">
              <CheckCircle size={32} />
              <p className="mt-2 font-semibold">Parameters Verified</p>
            </div>

            <div className="p-4 bg-blue-100 rounded-lg text-blue-700">
              <FileText size={32} />
              <p className="mt-2 font-semibold">Documents Verified</p>
            </div>

            <div className="p-4 bg-yellow-100 rounded-lg text-yellow-700">
              <Undo2 size={32} />
              <p className="mt-2 font-semibold">AI Alerts Reviewed</p>
            </div>

          </div>
        </section>

        {/* COMMENTS */}
        <section className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Final Review Notes</h2>

          <textarea
            placeholder="Add final remarks or justification for the approval decision..."
            className="w-full h-32 p-4 border rounded-xl focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </section>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-4 justify-end">

          {/* Approve */}
          <button className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            <CheckCircle size={20} /> Approve Application
          </button>

          {/* Reject */}
          <button className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
            <XCircle size={20} /> Reject Application
          </button>

          {/* Send Back */}
          <button className="flex items-center gap-2 px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">
            <Undo2 size={20} /> Send Back for Revision
          </button>

          {/* Generate Certificate */}
          <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <FileText size={20} /> Generate Final Certificate
          </button>

        </div>
      </div>
    </UGCLayout>
  );
};

export default ApprovalPage;
