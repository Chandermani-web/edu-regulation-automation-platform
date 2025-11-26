import React, { useState } from "react";
import Sidebar from "../../Components/Sidebar";
import {
  FileCheck,
  ClipboardList,
  CheckCircle,
  AlertTriangle,
  FileWarning,
  Send,
} from "lucide-react";

const ApplicationSubmission = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setShowConfirm(false);
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="w-full p-10">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-6">Application Submission</h1>

        {/* Already Submitted Banner */}
        {submitted && (
          <div className="bg-green-100 border border-green-500 text-green-700 px-6 py-4 rounded-lg mb-6">
            <b>Application Submitted Successfully!</b> Your application is now locked
            and under review by UGC/AICTE.
          </div>
        )}

        {/* Academic Year */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
          <label className="font-semibold text-lg">Academic Year *</label>
          <select className="w-full border p-3 rounded-lg mt-2">
            <option>Select Academic Year</option>
            <option>2023-24</option>
            <option>2024-25</option>
            <option>2025-26</option>
          </select>
        </div>

        {/* Parameter Review Section */}
        <section className="bg-white shadow-lg rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <ClipboardList className="text-blue-600" /> Parameter Review Summary
          </h2>

          <p className="text-gray-600 mb-4">
            Ensure all required parameters are properly filled in the Parameters Entry page.
          </p>

          <div className="grid grid-cols-3 gap-4">
            {[
              ["Student Strength", true],
              ["Faculty Details", true],
              ["Infrastructure", false],
              ["Labs & Equipment", true],
              ["Courses & Departments", true],
              ["Research & Innovation", false],
            ].map(([label, done], idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${
                  done ? "border-green-500 bg-green-50" : "border-yellow-500 bg-yellow-50"
                }`}
              >
                <div className="flex items-center gap-2 font-semibold">
                  {done ? (
                    <CheckCircle className="text-green-600" size={20} />
                  ) : (
                    <AlertTriangle className="text-yellow-600" size={20} />
                  )}
                  {label}
                </div>
                <p className="text-sm text-gray-700 mt-1">
                  {done ? "Completed" : "Some fields are pending"}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Document Review Section */}
        <section className="bg-white shadow-lg rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <FileCheck className="text-purple-600" /> Document Upload Summary
          </h2>

          <p className="text-gray-600 mb-4">
            Verify that all documents are uploaded and verified.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              ["Mandatory Documents", 12, 12],
              ["Academic Documents", 5, 7],
              ["Admin Records", 5, 5],
              ["Infrastructure Proofs", 3, 4],
              ["Financial Documents", 2, 3],
              ["Faculty CVs", 8, 9],
            ].map(([label, done, total], idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${
                  done === total
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                }`}
              >
                <div className="flex items-center gap-2 font-semibold">
                  {done === total ? (
                    <CheckCircle className="text-green-600" size={20} />
                  ) : (
                    <FileWarning className="text-red-600" size={20} />
                  )}
                  {label}
                </div>
                <p className="text-sm mt-1">
                  Uploaded:{" "}
                  <b>
                    {done}/{total}
                  </b>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Lock Warning */}
        <div className="bg-yellow-100 border border-yellow-500 text-yellow-700 px-6 py-4 rounded-lg mb-8 flex gap-3 items-center">
          <AlertTriangle size={22} />
          <p>
            <b>Warning:</b> After submission, the application will be locked. You cannot edit
            parameters or upload documents until the review is completed.
          </p>
        </div>

        {/* Remarks Section */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
          <label className="font-semibold text-lg">Remarks (Optional)</label>
          <textarea
            className="w-full border p-3 rounded-lg mt-2 h-28"
            placeholder="Any final remarks before submission..."
          ></textarea>
        </div>

        {/* Submit Button */}
        {!submitted && (
          <button
            onClick={() => setShowConfirm(true)}
            className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-blue-800 flex items-center gap-2"
          >
            <Send size={20} /> Submit Application
          </button>
        )}

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white rounded-xl p-6 shadow-xl w-96">
              <h2 className="text-xl font-bold mb-4">Confirm Submission</h2>
              <p className="mb-6">
                Are you sure you want to submit this application? You will not be
                able to make changes afterward.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-5 py-2 rounded-lg border"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 rounded-lg bg-blue-700 text-white font-semibold"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationSubmission;
