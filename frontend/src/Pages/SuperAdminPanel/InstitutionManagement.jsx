import React, { useState } from "react";
import SuperAdminLayout from "../../Components/SuperAdminLayout";
import { Search, Edit, Lock, FileText } from "lucide-react";

const InstitutionManagement = () => {
  // Dummy institution list
  const [institutions] = useState([
    {
      id: 1,
      name: "ABC Institute of Technology",
      code: "INST3401",
      state: "Rajasthan",
      uploads: 42,
    },
    {
      id: 2,
      name: "XYZ College of Engineering",
      code: "INST5520",
      state: "Maharashtra",
      uploads: 37,
    },
    {
      id: 3,
      name: "National Institute of Commerce",
      code: "INST7892",
      state: "Delhi",
      uploads: 21,
    },
  ]);

  return (
    <SuperAdminLayout>
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6">Institution Management</h1>

      {/* Search Bar */}
      <div className="flex items-center bg-white shadow p-4 rounded-xl mb-6">
        <Search className="text-gray-500" />
        <input
          type="text"
          placeholder="Search institutions..."
          className="ml-3 w-full outline-none"
        />
      </div>

      {/* Institution Table */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Institution List</h2>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Institution Name</th>
              <th className="p-3 border">Code</th>
              <th className="p-3 border">State</th>
              <th className="p-3 border text-center">Uploaded Docs</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {institutions.map((inst) => (
              <tr key={inst.id} className="border hover:bg-gray-50">
                <td className="p-3 border">{inst.name}</td>
                <td className="p-3 border">{inst.code}</td>
                <td className="p-3 border">{inst.state}</td>
                <td className="p-3 border text-center">{inst.uploads}</td>

                <td className="p-3 border">
                  <div className="flex justify-center gap-3">

                    {/* Edit Institution */}
                    <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Edit size={18} />
                    </button>

                    {/* Reset Password */}
                    <button className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                      <Lock size={18} />
                    </button>

                    {/* Monitor Uploaded Data */}
                    <button className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      <FileText size={18} />
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SuperAdminLayout>
  );
};

export default InstitutionManagement;
