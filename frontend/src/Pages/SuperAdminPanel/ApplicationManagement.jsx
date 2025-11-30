import React from "react";
import SuperAdminLayout from "../../Components/SuperAdminLayout";
import { Unlock, RefreshCcw, UserCog, Eye } from "lucide-react";

const ApplicationsManagement = () => {
  const applications = [
    {
      id: "APP001",
      institute: "ABC Institute",
      status: "Under Review",
      officer: "Dr. Mehta",
    },
    {
      id: "APP002",
      institute: "XYZ Engineering College",
      status: "Error (Locked)",
      officer: "Not Assigned",
    },
    {
      id: "APP003",
      institute: "Sunrise University",
      status: "Approved",
      officer: "Prof. Sharma",
    },
  ];

  return (
    <SuperAdminLayout>
      <h1 className="text-3xl font-bold mb-6">Applications Management</h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">

        <h2 className="text-xl font-semibold">All Applications</h2>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Application ID</th>
                <th className="p-3 border">Institution</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Assigned Officer</th>
                <th className="p-3 border text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 border">{app.id}</td>
                  <td className="p-3 border">{app.institute}</td>
                  <td
                    className={`p-3 border font-semibold ${
                      app.status.includes("Error")
                        ? "text-red-600"
                        : app.status.includes("Approved")
                        ? "text-green-600"
                        : "text-blue-600"
                    }`}
                  >
                    {app.status}
                  </td>
                  <td className="p-3 border">{app.officer}</td>

                  <td className="p-3 border">
                    <div className="flex gap-2 justify-center">

                      {/* View */}
                      <button
                        className="p-2 bg-blue-600 text-white rounded-lg"
                        title="View Application"
                      >
                        <Eye size={18} />
                      </button>

                      {/* Force Unlock */}
                      <button
                        className="p-2 bg-yellow-500 text-white rounded-lg"
                        title="Force Unlock"
                      >
                        <Unlock size={18} />
                      </button>

                      {/* Override Review */}
                      <button
                        className="p-2 bg-red-600 text-white rounded-lg"
                        title="Override Review"
                      >
                        <RefreshCcw size={18} />
                      </button>

                      {/* Reassign Officer */}
                      <button
                        className="p-2 bg-purple-600 text-white rounded-lg"
                        title="Reassign Officer"
                      >
                        <UserCog size={18} />
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default ApplicationsManagement;
