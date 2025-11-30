import React, { useState } from "react";
import SuperAdminLayout from "../../Components/SuperAdminLayout";
import { UserPlus, Users, ShieldCheck, Ban, CheckCircle } from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "ABC Institute Admin", role: "Institution", status: "active" },
    { id: 2, name: "UGC Officer Sharma", role: "UGC", status: "active" },
    { id: 3, name: "AICTE Officer Rani", role: "AICTE", status: "suspended" },
  ]);

  const toggleStatus = (id) => {
    setUsers(
      users.map((user) =>
        user.id === id
          ? { ...user, status: user.status === "active" ? "suspended" : "active" }
          : user
      )
    );
  };

  return (
    <SuperAdminLayout>
      <h1 className="text-3xl font-bold mb-8">User Management</h1>

      {/* ---------- ADD NEW USER SECTION ---------- */}
      <section className="bg-white p-6 shadow rounded-xl mb-10">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-700">
          <UserPlus size={22} /> Add New User
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <input
            type="text"
            placeholder="Full Name"
            className="p-3 border rounded-lg"
          />
          <input
            type="email"
            placeholder="Email"
            className="p-3 border rounded-lg"
          />

          <select className="p-3 border rounded-lg">
            <option value="">Select Role</option>
            <option value="Institution">Institution</option>
            <option value="UGC">UGC Officer</option>
            <option value="AICTE">AICTE Officer</option>
            <option value="SuperAdmin">Super Admin</option>
          </select>
        </div>

        <button className="mt-5 px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800">
          Add User
        </button>
      </section>

      {/* ---------- USER LIST TABLE ---------- */}
      <section className="bg-white p-6 shadow rounded-xl">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-700 mb-4">
          <Users size={22} /> Manage Users
        </h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="p-3">Name</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.role}</td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      user.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>

                <td className="p-3 flex gap-3">
                  {/* Toggle Status */}
                  <button
                    onClick={() => toggleStatus(user.id)}
                    className={`px-4 py-2 rounded-lg text-white ${
                      user.status === "active"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {user.status === "active" ? (
                      <span className="flex items-center gap-2">
                        <Ban size={16} /> Suspend
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CheckCircle size={16} /> Activate
                      </span>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </SuperAdminLayout>
  );
};

export default UserManagement;
