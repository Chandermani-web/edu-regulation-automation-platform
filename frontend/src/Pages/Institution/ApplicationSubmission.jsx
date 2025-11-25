import React, { useState } from "react";
import Sidebar from "../../Components/Sidebar";

const ApplicationSubmission = () => {
  const [form, setForm] = useState({
    academicYear: "",
    remarks: "",
    parametersUploaded: false,
    documentsUploaded: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    alert("Application Submitted Successfully!");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex flex-col w-full p-8">
        <h1 className="text-2xl font-bold mb-6">Application Submission</h1>
        <p className="mb-6 text-gray-600">
          Fill the required details and submit the application for UGC/AICTE approval.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Academic Year */}
          <div className="bg-white shadow rounded p-6">
            <label className="font-semibold">Academic Year *</label>
            <select
              name="academicYear"
              value={form.academicYear}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-2"
            >
              <option value="">Select Academic Year</option>
              <option value="2024-2025">2024-2025</option>
              <option value="2023-2024">2023-2024</option>
              <option value="2022-2023">2022-2023</option>
            </select>
          </div>

          {/* Parameter Confirmation */}
          <div className="bg-white shadow rounded p-6">
            <h2 className="font-semibold text-lg mb-2">Parameter Filling</h2>
            <p className="text-gray-600 mb-3">
              Ensure all parameters are filled correctly in the Parameters Entry Page.
            </p>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="parametersUploaded"
                checked={form.parametersUploaded}
                onChange={handleChange}
              />
              <span>All parameters filled</span>
            </label>
          </div>

          {/* Document Confirmation */}
          <div className="bg-white shadow rounded p-6">
            <h2 className="font-semibold text-lg mb-2">Document Upload</h2>
            <p className="text-gray-600 mb-3">
              Ensure all required documents have been uploaded in the Document Upload page.
            </p>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="documentsUploaded"
                checked={form.documentsUploaded}
                onChange={handleChange}
              />
              <span>All documents uploaded</span>
            </label>
          </div>

          {/* Remarks */}
          <div className="bg-white shadow rounded p-6">
            <label className="font-semibold">Remarks (optional)</label>
            <textarea
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              className="w-full border p-2 rounded h-24 mt-2"
              placeholder="Any remarks before submission"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              !form.academicYear ||
              !form.parametersUploaded ||
              !form.documentsUploaded
            }
            className={`px-6 py-3 rounded-lg font-semibold text-white ${
              form.academicYear &&
              form.parametersUploaded &&
              form.documentsUploaded
                ? "bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Submit Application
          </button>

          {/* Success Message */}
          {submitted && (
            <p className="text-green-600 mt-4 font-semibold text-lg">
              🎉 Application successfully submitted!
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ApplicationSubmission;
