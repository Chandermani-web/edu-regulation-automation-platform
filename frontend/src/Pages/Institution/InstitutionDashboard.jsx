import React from "react";
import Layout from "../../Components/Layout";
import {
  FileCheck,
  CheckCircle,
  XCircle,
  Clock,
  MessagesSquare,
  Bot,
} from "lucide-react";

const InstitutionDashboard = () => {
  return (
    <Layout showNavbar={true}>
      <div className="animate-fadeIn">

        {/* ----- PAGE TITLE ----- */}
        <h1 className="text-3xl font-bold text-slate-900 mb-8 animate-slideDown">
          Institution Dashboard
        </h1>

        {/* ===================== PROFILE CARD ===================== */}
        <section className="bg-white border border-gray-200 shadow-sm rounded-2xl p-8 mb-10 animate-slideUp">
          <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2 mb-6">
            <FileCheck /> Institution Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            <p><b>Name:</b> Example Institute of Technology</p>
            <p><b>Code:</b> INST2301</p>
            <p><b>Institution Type:</b> Private</p>
            <p><b>City:</b> Jaipur</p>
            <p><b>State:</b> Rajasthan</p>
            <p><b>Pincode:</b> 302020</p>

            <p className="md:col-span-2">
              <b>Address:</b> 123 Knowledge Road, Jaipur
            </p>

            <p><b>Email:</b> principal@eit.ac.in</p>
            <p><b>Phone:</b> +91 9876543210</p>
          </div>
        </section>

        {/* ===================== STATS CARDS ===================== */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          <div className="card hover:scale-105 transition-transform animate-slideUp delay-100">
            <h3>Total Applications</h3>
            <p className="count">05</p>
          </div>

          <div className="card hover:scale-105 transition-transform animate-slideUp delay-200">
            <h3 className="flex items-center gap-2">
              <CheckCircle className="text-green-600" /> Approved
            </h3>
            <p className="count text-green-700">02</p>
          </div>

          <div className="card hover:scale-105 transition-transform animate-slideUp delay-300">
            <h3 className="flex items-center gap-2">
              <Clock className="text-yellow-500" /> Pending
            </h3>
            <p className="count text-yellow-600">03</p>
          </div>

          <div className="card hover:scale-105 transition-transform animate-slideUp delay-400">
            <h3 className="flex items-center gap-2">
              <XCircle className="text-red-500" /> Rejected
            </h3>
            <p className="count text-red-600">01</p>
          </div>

          <div className="card hover:scale-105 transition-transform animate-slideUp delay-500">
            <h3 className="flex items-center gap-2">
              <MessagesSquare className="text-blue-500" /> Queries
            </h3>
            <p className="count text-blue-600">01</p>
          </div>
        </section>

        {/* ===================== DOCUMENT STATUS ===================== */}
        <section className="bg-white border shadow-sm rounded-2xl p-8 mb-10 animate-slideUp">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-3">
            <FileCheck className="text-purple-700" /> Document Upload Status
          </h2>

          <p className="text-lg font-semibold text-slate-700">
            Uploaded: <span className="text-green-600">25</span> / 30
          </p>
          <p className="text-sm text-gray-500">5 documents pending upload</p>

          <div className="w-full bg-gray-200 h-3 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-green-600 h-3 rounded-full animate-progress"
              style={{ width: "83%" }}
            />
          </div>
        </section>

        {/* ===================== AI SCORE ===================== */}
        <div className="flex justify-end animate-slideUp">
          <div className="bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-700 
            text-white shadow-xl rounded-2xl p-6 w-56 text-center animate-pulseSlow">
            <h3 className="flex items-center justify-center gap-2">
              <Bot className="text-yellow-300" /> AI Score
            </h3>
            <p className="text-5xl font-bold mt-3">86%</p>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default InstitutionDashboard;
