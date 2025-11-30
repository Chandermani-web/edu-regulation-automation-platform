import React from "react";
import UGCLayout from "../../Components/UGCLayout";

import { Eye, BarChart3, ArrowUpRight, FileCheck } from "lucide-react";

const ApplicationReview = () => {
  return (
    <UGCLayout showNavbar={false}>
      <div className="p-6 space-y-10">
        <h1 className="text-2xl font-bold text-gray-800">Application Review</h1>

        <section className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Institution Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-gray-600">
            <p><strong>Name:</strong> ABC Institute of Technology</p>
            <p><strong>Type:</strong> Private</p>
            <p><strong>Established:</strong> 1998</p>
            <p><strong>State:</strong> Rajasthan</p>
            <p><strong>Affiliation:</strong> AICTE</p>
            <p><strong>AISHE Code:</strong> A123456</p>
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-gray-700">Parameter Summary (Read-Only)</h2>

          <div className="mt-4 space-y-3">
            <div className="p-4 bg-gray-100 rounded-lg flex justify-between">
              <p>Faculty Qualification</p>
              <p className="font-semibold text-green-600">Meets Criteria</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg flex justify-between">
              <p>Infrastructure & Labs</p>
              <p className="font-semibold text-yellow-600">Needs Review</p>
            </div>
           
            <div className="p-4 bg-gray-100 rounded-lg flex justify-between">
              <p>Placement Records</p>
              <p className="font-semibold text-red-600">Insufficient</p>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-gray-700">Institution Documents</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-gray-100 rounded-lg flex items-center justify-between">
              <p>Registration Certificate</p>
              <Eye size={20} className="cursor-pointer text-blue-600" />
            </div>

            <div className="p-4 bg-gray-100 rounded-lg flex items-center justify-between">
              <p>Faculty Data</p>
              <Eye size={20} className="cursor-pointer text-blue-600" />
            </div>

            <div className="p-4 bg-gray-100 rounded-lg flex items-center justify-between">
              <p>Lab Equipment List</p>
              <Eye size={20} className="cursor-pointer text-blue-600" />
            </div>

           
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-gray-700">AI Analysis Summary</h2>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-indigo-100 text-indigo-700 rounded-lg">
              <BarChart3 size={20} />
              <p className="mt-2 font-medium">Risk Score: 12%</p>
            </div>

            <div className="p-4 bg-yellow-100 text-yellow-700 rounded-lg">
              <ArrowUpRight size={20} />
              <p className="mt-2 font-medium">Performance Drop: 8%</p>
            </div>

            <div className="p-4 bg-green-100 text-green-700 rounded-lg">
              <FileCheck size={20} />
              <p className="mt-2 font-medium">AI Review Matches Human: 91%</p>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-gray-700">Previous Year Comparison</h2>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-gray-500 text-sm">2022</p>
              <p className="text-xl font-bold">76%</p>
            </div>

            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-gray-500 text-sm">2023</p>
              <p className="text-xl font-bold">79%</p>
            </div>

            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-gray-500 text-sm">2024</p>
              <p className="text-xl font-bold">81%</p>
            </div>

            <div className="bg-green-100 rounded-lg p-4">
              <p className="text-gray-500 text-sm">2025</p>
              <p className="text-xl font-bold text-green-700">87%</p>
            </div>
          </div>
        </section>

        <div className="flex gap-4 justify-end">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg">Approve</button>
          <button className="px-6 py-2 bg-red-600 text-white rounded-lg">Reject</button>
          <button className="px-6 py-2 bg-yellow-500 text-white rounded-lg">Send Back</button>
        </div>
      </div>
    </UGCLayout>
  );
};

export default ApplicationReview;
