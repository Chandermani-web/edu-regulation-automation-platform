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
        <section className="bg-white border border-gray-200 shadow-md rounded-2xl p-10 mb-12 animate-slideUp">
          <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2 mb-8">
            <FileCheck className="text-purple-700" />
            Institution Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-gray-700">

            {/* LEFT SIDE FIELDS */}
            <div className="space-y-6">
              <div>
                <label className="font-semibold text-slate-700 text-sm mb-1 block">Name:</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter institution name"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 text-sm mb-1 block">Code:</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter code"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 text-sm mb-1 block">Institution Type:</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Private / Government"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 text-sm mb-1 block">Email:</label>
                <input
                  type="email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter email"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 text-sm mb-1 block">Phone:</label>
                <input
                  type="tel"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* RIGHT SIDE FIELDS */}
            <div className="space-y-6">
              <div>
                <label className="font-semibold text-slate-700 text-sm mb-1 block">State:</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter state"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 text-sm mb-1 block">City:</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 text-sm mb-1 block">Pincode:</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter pincode"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 text-sm mb-1 block">Address:</label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows="3"
                  placeholder="Enter full address"
                ></textarea>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== STATS CARDS ===================== */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <div className="card hover:scale-105 transition-transform shadow-md rounded-xl p-5 bg-white">
            <h3 className="text-gray-600">Total Applications</h3>
            <p className="count text-3xl font-bold text-slate-800">05</p>
          </div>

          <div className="card hover:scale-105 transition-transform shadow-md rounded-xl p-5 bg-white">
            <h3 className="flex items-center gap-2 text-gray-600">
              <CheckCircle className="text-green-600" /> Approved
            </h3>
            <p className="count text-3xl font-bold text-green-700">02</p>
          </div>

          <div className="card hover:scale-105 transition-transform shadow-md rounded-xl p-5 bg-white">
            <h3 className="flex items-center gap-2 text-gray-600">
              <Clock className="text-yellow-500" /> Pending
            </h3>
            <p className="count text-3xl font-bold text-yellow-600">03</p>
          </div>

          <div className="card hover:scale-105 transition-transform shadow-md rounded-xl p-5 bg-white">
            <h3 className="flex items-center gap-2 text-gray-600">
              <XCircle className="text-red-500" /> Rejected
            </h3>
            <p className="count text-3xl font-bold text-red-600">01</p>
          </div>

          <div className="card hover:scale-105 transition-transform shadow-md rounded-xl p-5 bg-white">
            <h3 className="flex items-center gap-2 text-gray-600">
              <MessagesSquare className="text-blue-500" /> Queries
            </h3>
            <p className="count text-3xl font-bold text-blue-600">01</p>
          </div>
        </section>

        {/* ===================== DOCUMENT STATUS ===================== */}
        <section className="bg-white border shadow-md rounded-2xl p-10 mb-12 animate-slideUp">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
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
            ></div>
          </div>
        </section>

        {/* ===================== AI SCORE ===================== */}
        <div className="flex justify-end animate-slideUp">
          <div className="bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-700 
            text-white shadow-xl rounded-2xl p-6 w-56 text-center">
            <h3 className="flex items-center justify-center gap-2 text-lg">
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
