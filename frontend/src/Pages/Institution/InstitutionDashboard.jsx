import React from "react";
import Sidebar from "../../Components/Sidebar";
import { 
  FileCheck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessagesSquare, 
  Bot 
} from "lucide-react";

const InstitutionDashboard = () => {
  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />

      <div className="flex flex-col w-full p-10">

        {/* ===================== PAGE TITLE ===================== */}
        <h1 className="text-3xl font-bold text-slate-900 mb-8">
          Institution Dashboard
        </h1>

        {/* ===================== PROFILE CARD ===================== */}
        <section className="bg-white border border-gray-200 shadow-sm rounded-2xl p-8 mb-10">
          <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2 mb-6">
            <FileCheck className="text-royal" /> Institution Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">

            <p><b className="text-slate-800">Name:</b> Example Institute of Technology</p>
            <p><b className="text-slate-800">Code:</b> INST2301</p>

            <p><b className="text-slate-800">Institution Type:</b> Private</p>
            <p><b className="text-slate-800">City:</b> Jaipur</p>

            <p><b className="text-slate-800">State:</b> Rajasthan</p>
            <p><b className="text-slate-800">Pincode:</b> 302020</p>

            <p className="md:col-span-2">
              <b className="text-slate-800">Address:</b> 123 Knowledge Road, Jaipur, Rajasthan
            </p>

            {/* PRINCIPAL DETAILS */}
            <p><b className="text-slate-800">Principal Name:</b> Dr. Rohan Sharma</p>
            <p><b className="text-slate-800">Email:</b> principal@eit.ac.in</p>
            <p><b className="text-slate-800">Phone:</b> +91 9876543210</p>

          </div>
        </section>


        {/* ===================== STATS CARDS ===================== */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">

          {/* TOTAL APPLICATIONS */}
          <div className="bg-white border shadow-sm rounded-2xl p-6 text-center hover:shadow-md transition">
            <h3 className="text-md font-medium text-slate-600 mb-2">
              Total Applications
            </h3>
            <p className="text-4xl font-bold text-slate-900">05</p>
          </div>

          {/* APPROVED */}
          <div className="bg-white border shadow-sm rounded-2xl p-6 text-center hover:shadow-md transition">
            <h3 className="text-md font-medium text-slate-600 mb-2 flex justify-center items-center gap-2">
              <CheckCircle className="text-green-600" /> Approved
            </h3>
            <p className="text-4xl font-bold text-green-700">02</p>
          </div>

          {/* PENDING */}
          <div className="bg-white border shadow-sm rounded-2xl p-6 text-center hover:shadow-md transition">
            <h3 className="text-md font-medium text-slate-600 mb-2 flex justify-center items-center gap-2">
              <Clock className="text-yellow-500" /> Pending
            </h3>
            <p className="text-4xl font-bold text-yellow-600">03</p>
          </div>

          {/* REJECTED */}
          <div className="bg-white border shadow-sm rounded-2xl p-6 text-center hover:shadow-md transition">
            <h3 className="text-md font-medium text-slate-600 mb-2 flex justify-center items-center gap-2">
              <XCircle className="text-red-500" /> Rejected
            </h3>
            <p className="text-4xl font-bold text-red-600">01</p>
          </div>

          {/* QUERIES */}
          <div className="bg-white border shadow-sm rounded-2xl p-6 text-center hover:shadow-md transition">
            <h3 className="text-md font-medium text-slate-600 mb-2 flex justify-center items-center gap-2">
              <MessagesSquare className="text-blue-500" /> Queries
            </h3>
            <p className="text-4xl font-bold text-blue-600">01</p>
          </div>

        </section>


        {/* ===================== DOCUMENT UPLOAD PROGRESS ===================== */}
        <section className="bg-white border border-gray-200 shadow-sm rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-4">
            <FileCheck className="text-purple-700" /> Document Upload Status
          </h2>

          <p className="text-lg font-semibold text-slate-700">
            Uploaded: <span className="text-green-600 font-bold">25</span> / 30
          </p>
          <p className="text-sm text-gray-500">5 documents pending upload</p>

          <div className="w-full bg-gray-200 h-3 rounded-full mt-4">
            <div
              className="bg-green-600 h-3 rounded-full transition-all"
              style={{ width: "83%" }}
            ></div>
          </div>
        </section>


        {/* ===================== AI SCORE CARD ===================== */}
        <div className="flex justify-end">
          <div className="bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-700 
          text-white shadow-xl rounded-2xl p-6 w-56 text-center">
            <h3 className="text-md font-semibold flex justify-center items-center gap-2">
              <Bot className="text-yellow-300" /> AI Score
            </h3>
            <p className="text-5xl font-bold mt-3">86%</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InstitutionDashboard;
