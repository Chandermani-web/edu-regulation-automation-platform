import React from "react";
import SuperAdminLayout from "../../Components/SuperAdminLayout";
import { Users, GraduationCap, ClipboardList, CheckCircle, Activity, Bot } from "lucide-react";

const SuperAdminDashboard = () => {
  return (
    <SuperAdminLayout>
      <h1 className="text-3xl font-bold mb-6">Super Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="p-6 bg-white shadow rounded-xl flex items-center gap-4">
          <Users size={40} className="text-blue-600" />
          <div>
            <p className="text-gray-600">Total Users</p>
            <h2 className="text-3xl font-bold">120</h2>
          </div>
        </div>

        <div className="p-6 bg-white shadow rounded-xl flex items-center gap-4">
          <GraduationCap size={40} className="text-green-600" />
          <div>
            <p className="text-gray-600">Total Institutions</p>
            <h2 className="text-3xl font-bold">84</h2>
          </div>
        </div>

        <div className="p-6 bg-white shadow rounded-xl flex items-center gap-4">
          <ClipboardList size={40} className="text-yellow-600" />
          <div>
            <p className="text-gray-600">Pending Applications</p>
            <h2 className="text-3xl font-bold">19</h2>
          </div>
        </div>

        <div className="p-6 bg-white shadow rounded-xl flex items-center gap-4">
          <CheckCircle size={40} className="text-green-700" />
          <div>
            <p className="text-gray-600">Approvals</p>
            <h2 className="text-3xl font-bold">56</h2>
          </div>
        </div>

        <div className="p-6 bg-white shadow rounded-xl flex items-center gap-4">
          <Activity size={40} className="text-purple-700" />
          <div>
            <p className="text-gray-600">System Logs</p>
            <h2 className="text-3xl font-bold">302</h2>
          </div>
        </div>

        <div className="p-6 bg-white shadow rounded-xl flex items-center gap-4">
          <Bot size={40} className="text-indigo-700" />
          <div>
            <p className="text-gray-600">AI Monitoring</p>
            <h2 className="text-3xl font-bold">Active</h2>
          </div>
        </div>

      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminDashboard;
