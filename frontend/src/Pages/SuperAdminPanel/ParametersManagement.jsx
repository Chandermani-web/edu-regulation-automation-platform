import React, { useState } from "react";
import SuperAdminLayout from "../../Components/SuperAdminLayout";
import { Plus, Settings, ListTree, SlidersHorizontal } from "lucide-react";

const ParametersManagement = () => {
  const [parameters, setParameters] = useState([]);
  const [newParam, setNewParam] = useState("");

  return (
    <SuperAdminLayout>
      <div className="space-y-10">

        {/* PAGE TITLE */}
        <h1 className="text-3xl font-bold">Parameters Management</h1>

        {/* ADD NEW PARAMETER */}
        <section className="bg-white p-6 shadow rounded-xl space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Plus size={20} className="text-green-600" /> Add New Parameter
          </h2>

          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter parameter name..."
              value={newParam}
              onChange={(e) => setNewParam(e.target.value)}
              className="border p-3 rounded-lg w-full"
            />
            <button
              className="px-5 py-2 bg-green-600 text-white rounded-lg"
              onClick={() => {
                if (newParam.trim()) {
                  setParameters([...parameters, { name: newParam }]);
                  setNewParam("");
                }
              }}
            >
              Add
            </button>
          </div>
        </section>

        {/* UPDATE PARAMETER RULES */}
        <section className="bg-white p-6 shadow rounded-xl space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Settings size={20} className="text-blue-600" /> Update Parameter Rules
          </h2>

          {parameters.length === 0 ? (
            <p className="text-gray-500">No parameters added yet.</p>
          ) : (
            <div className="space-y-4">
              {parameters.map((param, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center"
                >
                  <div>
                    <p className="font-semibold">{param.name}</p>
                    <small className="text-gray-500">
                      Example rules: min length, max score, weight % etc.
                    </small>
                  </div>

                  <button className="mt-2 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg">
                    Edit Rules
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CATEGORY MANAGEMENT */}
        <section className="bg-white p-6 shadow rounded-xl">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ListTree size={20} className="text-purple-600" /> Parameter Categories
          </h2>

          <div className="grid md:grid-cols-3 gap-4 mt-4">
            {["Academic", "Infrastructure", "Finance"].map((cat, i) => (
              <div
                key={i}
                className="p-4 bg-gray-100 rounded-lg text-center font-medium"
              >
                {cat}
              </div>
            ))}
          </div>

          <button className="mt-4 px-5 py-2 bg-purple-600 text-white rounded-lg">
            Add Category
          </button>
        </section>

        {/* PARAMETER MAPPING */}
        <section className="bg-white p-6 shadow rounded-xl space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <SlidersHorizontal size={20} className="text-orange-600" /> Map Parameters to Roles
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {/* UGC */}
            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">UGC</h3>
              <ul className="space-y-2">
                {parameters.map((p, i) => (
                  <li key={i} className="text-gray-600">{p.name}</li>
                ))}
              </ul>
            </div>

            {/* AICTE */}
            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">AICTE</h3>
              <ul className="space-y-2">
                {parameters.map((p, i) => (
                  <li key={i} className="text-gray-600">{p.name}</li>
                ))}
              </ul>
            </div>

            {/* Institution */}
            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Institution</h3>
              <ul className="space-y-2">
                {parameters.map((p, i) => (
                  <li key={i} className="text-gray-600">{p.name}</li>
                ))}
              </ul>
            </div>

          </div>
        </section>
      </div>
    </SuperAdminLayout>
  );
};

export default ParametersManagement;
