import React from "react";
import SuperAdminLayout from "../../Components/SuperAdminLayout";
import { Activity, FileText, Users, ShieldAlert } from "lucide-react";

const LogsAnalytics = () => {
  return (
    <SuperAdminLayout>
      <div className="space-y-10">
        <h1 className="text-3xl font-bold mb-4">Logs & Analytics</h1>

        {/* ---------------- USER ACTIVITY LOGS ---------------- */}
        <section className="bg-white rounded-xl shadow p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Users className="text-blue-600" size={28} />
            <h2 className="text-xl font-semibold">User Activity Log</h2>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-gray-100 rounded-lg">
              <p><strong>User:</strong> Institution A</p>
              <p><strong>Action:</strong> Uploaded new document</p>
              <p><strong>Time:</strong> 10:23 AM</p>
            </div>

            <div className="p-4 bg-gray-100 rounded-lg">
              <p><strong>User:</strong> UGC Officer</p>
              <p><strong>Action:</strong> Reviewed Application #1234</p>
              <p><strong>Time:</strong> 09:10 AM</p>
            </div>
          </div>
        </section>

        {/* ---------------- DOCUMENT HISTORY LOG ---------------- */}
        <section className="bg-white rounded-xl shadow p-6 space-y-4">
          <div className="flex items-center gap-3">
            <FileText className="text-purple-600" size={28} />
            <h2 className="text-xl font-semibold">Document History Log</h2>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-gray-100 rounded-lg">
              <p><strong>Document:</strong> Financial Report.pdf</p>
              <p><strong>Changes:</strong> Updated version uploaded</p>
              <p><strong>Time:</strong> Yesterday</p>
            </div>

            <div className="p-4 bg-gray-100 rounded-lg">
              <p><strong>Document:</strong> Faculty Details.xlsx</p>
              <p><strong>Changes:</strong> Corrections requested</p>
              <p><strong>Time:</strong> 2 days ago</p>
            </div>
          </div>
        </section>

        {/* ---------------- SYSTEM ERRORS ---------------- */}
        <section className="bg-white rounded-xl shadow p-6 space-y-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="text-red-600" size={28} />
            <h2 className="text-xl font-semibold">System-Wide Error Tracking</h2>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-red-100 text-red-700 rounded-lg">
              <p><strong>Error:</strong> Server timeout on Application Review</p>
              <p><strong>Reported:</strong> 1 hour ago</p>
            </div>

            <div className="p-4 bg-red-100 text-red-700 rounded-lg">
              <p><strong>Error:</strong> Invalid document format detected</p>
              <p><strong>Reported:</strong> 3 hours ago</p>
            </div>
          </div>
        </section>

        {/* ---------------- AUDIT TRAIL ---------------- */}
        <section className="bg-white rounded-xl shadow p-6 space-y-4 mb-10">
          <div className="flex items-center gap-3">
            <Activity className="text-green-600" size={28} />
            <h2 className="text-xl font-semibold">Audit Trails</h2>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-gray-100 rounded-lg">
              <p><strong>Action:</strong> Parameter updated: “Faculty Ratio Rule”</p>
              <p><strong>Edited By:</strong> Super Admin</p>
              <p><strong>Date:</strong> Today</p>
            </div>

            <div className="p-4 bg-gray-100 rounded-lg">
              <p><strong>Action:</strong> Application reassigned to UGC Officer</p>
              <p><strong>Edited By:</strong> System</p>
              <p><strong>Date:</strong> 2 days ago</p>
            </div>
          </div>
        </section>
      </div>
    </SuperAdminLayout>
  );
};

export default LogsAnalytics;
