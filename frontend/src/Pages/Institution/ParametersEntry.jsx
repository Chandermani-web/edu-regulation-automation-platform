import React, { useState } from "react";
import Sidebar from "../../Components/Sidebar";

const ParametersEntry = () => {
  const [form, setForm] = useState({
    total_students: "",
    ug_students: "",
    pg_students: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-col w-full p-6">
        <h1 className="text-2xl font-bold mb-6">Parameters Entry</h1>

        <p className="text-gray-600 mb-4">
          Fill all required parameters for UGC / AICTE approval.
          <br />
          Data auto-saves section by section.
        </p>

        {/* Student Strength Section */}
        <h2 className="text-xl font-semibold mb-4">Student Strength</h2>

        <div className="bg-white shadow rounded p-6 mb-6">

          <label className="font-medium">Total Students</label>
          <input
            type="number"
            name="total_students"
            value={form.total_students}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1 mb-4"
            placeholder="Enter number"
          />

          <label className="font-medium">UG Students</label>
          <input
            type="number"
            name="ug_students"
            value={form.ug_students}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1 mb-4"
            placeholder="Enter number"
          />

          <label className="font-medium">PG Students</label>
          <input
            type="number"
            name="pg_students"
            value={form.pg_students}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1 mb-4"
            placeholder="Enter number"
          />
        </div>

        {/* Save Button */}
        <button className="bg-blue-600 text-white px-6 py-2 rounded font-semibold">
          Save Parameters
        </button>
      </div>
    </div>
  );
};

export default ParametersEntry;
