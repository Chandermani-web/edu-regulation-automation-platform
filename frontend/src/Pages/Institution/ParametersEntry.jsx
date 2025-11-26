import React, { useState } from "react";
import Sidebar from "../../Components/Sidebar";
import { Upload, AlertTriangle, Save } from "lucide-react";

const ParametersEntry = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="w-full p-10">
        <h1 className="text-3xl font-bold mb-4 text-[#0A3D62]">
          Parameters Entry
        </h1>
        <p className="text-gray-600 mb-6">
          Fill all required parameters for UGC / AICTE approval.
          <br />
          Data auto-saves section-wise.
        </p>

        {/* ----------- 1. STUDENT STRENGTH ----------- */}
        <section className="bg-white shadow rounded-xl p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4 text-[#5A189A]">
            Student Strength
          </h2>

          <div className="space-y-4">
            <div>
              <label className="font-semibold text-gray-700">
                Total Students
              </label>
              <input
                className="w-full border p-3 rounded mt-1"
                placeholder="Enter number"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">UG Students</label>
              <input
                className="w-full border p-3 rounded mt-1"
                placeholder="Enter number"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">PG Students</label>
              <input
                className="w-full border p-3 rounded mt-1"
                placeholder="Enter number"
              />
            </div>
          </div>
        </section>

        {/* ----------- 2. FACULTY DETAILS ----------- */}
        <section className="bg-white shadow rounded-xl p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4 text-[#5A189A]">
            Faculty Details
          </h2>

          <div className="grid grid-cols-3 gap-6">
            <input className="border p-3 rounded" placeholder="Total Faculty" />
            <input
              className="border p-3 rounded"
              placeholder="Teaching Faculty"
            />
            <input className="border p-3 rounded" placeholder="PhD Faculty" />
            <input
              className="border p-3 rounded"
              placeholder="Technical Staff"
            />
            <input
              className="border p-3 rounded"
              placeholder="Non-Teaching Staff"
            />
          </div>

          {/* Upload Document */}
          <div className="mt-4">
            <label className="font-semibold">Upload Supporting Document</label>
            <div className="flex items-center gap-3 mt-2">
              <input type="file" className="border p-2 rounded" />
              <Upload className="text-gray-600" />
            </div>
          </div>
        </section>

        {/* ----------- 3. INFRASTRUCTURE ----------- */}
        <section className="bg-white shadow rounded-xl p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4 text-[#5A189A]">
            Infrastructure
          </h2>

          <div className="grid grid-cols-3 gap-6">
            <input
              className="border p-3 rounded"
              placeholder="Total Classrooms"
            />
            <input
              className="border p-3 rounded"
              placeholder="Smart Classrooms"
            />
            <input className="border p-3 rounded" placeholder="Laboratories" />
            <input
              className="border p-3 rounded"
              placeholder="Library Books Count"
            />
            <input
              className="border p-3 rounded"
              placeholder="Library Area (sq ft)"
            />
            <input
              className="border p-3 rounded"
              placeholder="ICT Enabled Rooms"
            />
          </div>
        </section>

        {/* ----------- 4. FINANCIAL DETAILS ----------- */}
        <section className="bg-white shadow rounded-xl p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4 text-[#5A189A]">
            Financial Details
          </h2>

          <div className="grid grid-cols-3 gap-6">
            <input className="border p-3 rounded" placeholder="Annual Budget" />
            <input
              className="border p-3 rounded"
              placeholder="Funds Received"
            />
            <input
              className="border p-3 rounded"
              placeholder="Funds Utilized"
            />
          </div>
        </section>

        {/* ----------- 5. PLACEMENT DETAILS ----------- */}
        <section className="bg-white shadow rounded-xl p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4 text-[#5A189A]">
            Placement Statistics
          </h2>

          <div className="grid grid-cols-3 gap-6">
            <input
              className="border p-3 rounded"
              placeholder="Total Students Placed"
            />
            <input
              className="border p-3 rounded"
              placeholder="Highest Package"
            />
            <input
              className="border p-3 rounded"
              placeholder="Average Package"
            />
          </div>
        </section>

        {/* ----------- 6. RESEARCH & INNOVATION ----------- */}
        <section className="bg-white shadow rounded-xl p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4 text-[#5A189A]">
            Research & Innovation
          </h2>

          <div className="grid grid-cols-3 gap-6">
            <input
              className="border p-3 rounded"
              placeholder="Research Papers Published"
            />
            <input className="border p-3 rounded" placeholder="Patents Filed" />
            <input
              className="border p-3 rounded"
              placeholder="Patents Granted"
            />
          </div>

          {/* AI suggestion */}
          <div className="flex items-center gap-3 mt-4 text-yellow-600">
            <AlertTriangle />
            <p>Your research data looks incomplete. Please verify entries.</p>
          </div>
        </section>

        {/* ----------- SAVE BUTTON ----------- */}
        <button className="bg-blue-700 text-white w-full py-3 rounded-lg font-bold flex justify-center gap-2 hover:bg-blue-800">
          <Save /> Save Parameters
        </button>
      </div>
    </div>
  );
};

export default ParametersEntry;
