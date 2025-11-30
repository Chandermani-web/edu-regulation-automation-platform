import UGCLayout from "../../Components/UGCLayout";
import { FileCheck, FileX, Eye, MessageSquare, BarChart3, ClipboardList } from "lucide-react";

const UGCDashboard = () => {
  return (

    <UGCLayout showNavbar={true}>
      <div className="p-6 space-y-8">

        {/* Page Title */}
        <h1 className="text-2xl font-bold text-gray-800">UGC / AICTE Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Applications Received */}
          <div className="bg-white p-6 shadow rounded-xl flex items-center gap-4 hover:shadow-lg transition">
            <ClipboardList size={40} className="text-blue-600" />
            <div>
              <p className="text-gray-600">Applications Received</p>
              <h2 className="text-3xl font-bold text-gray-800">42</h2>
            </div>
          </div>

          {/* Under Review */}
          <div className="bg-white p-6 shadow rounded-xl flex items-center gap-4 hover:shadow-lg transition">
            <Eye size={40} className="text-yellow-600" />
            <div>
              <p className="text-gray-600">Under Review</p>
              <h2 className="text-3xl font-bold text-gray-800">18</h2>
            </div>
          </div>

          {/* Approved / Rejected */}
          <div className="bg-white p-6 shadow rounded-xl flex items-center gap-4 hover:shadow-lg transition">
            <FileCheck size={40} className="text-green-600" />
            <div>
              <p className="text-gray-600">Approved / Rejected</p>
              <h2 className="text-3xl font-bold text-gray-800">12 / 5</h2>
            </div>
          </div>

          {/* Pending Queries */}
          <div className="bg-white p-6 shadow rounded-xl flex items-center gap-4 hover:shadow-lg transition">
            <MessageSquare size={40} className="text-purple-600" />
            <div>
              <p className="text-gray-600">Pending Queries</p>
              <h2 className="text-3xl font-bold text-gray-800">6</h2>
            </div>
          </div>

          {/* Document Verification Required */}
          <div className="bg-white p-6 shadow rounded-xl flex items-center gap-4 hover:shadow-lg transition">
            <FileX size={40} className="text-red-600" />
            <div>
              <p className="text-gray-600">Document Verification</p>
              <h2 className="text-3xl font-bold text-gray-800">10</h2>
            </div>
          </div>

          {/* AI Analysis Summary */}
          <div className="bg-white p-6 shadow rounded-xl flex items-center gap-4 hover:shadow-lg transition">
            <BarChart3 size={40} className="text-indigo-600" />
            <div>
              <p className="text-gray-600">AI Analysis Alerts</p>
              <h2 className="text-3xl font-bold text-gray-800">3</h2>
            </div>
          </div>

        </div>
      </div>
    </UGCLayout>
  );
};

export default UGCDashboard;
