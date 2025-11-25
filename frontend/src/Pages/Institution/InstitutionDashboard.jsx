import React from "react";
import Sidebar from "../../Components/Sidebar";

const InstitutionDashboard = () => {
    return (
  <div className="flex min-h-screen bg-gray-50">

    {/* SIDEBAR */}
    <Sidebar />

    {/* MAIN CONTENT */}
    <div className="w-full p-8">

      {/* TOP HEADING */}
      <h1 className="text-3xl font-bold mb-6">Institution Dashboard</h1>

      {/* PROFILE CARD */}
      <section className="bg-white shadow rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">🏛️ Institution Profile</h2>

        <p><b>Name:</b> Example Institute of Technology</p>
        <p><b>Code:</b> INST2301</p>
        <p><b>State:</b> Rajasthan</p>
      </section>


      {/* STAT CARDS */}
      <section className="grid grid-cols-4 gap-5">

        <div className="bg-white shadow rounded-xl p-6 text-center">
          <h3 className="text-md font-semibold">Total Applications</h3>
          <p className="text-3xl font-bold mt-2">05</p>
        </div>

        <div className="bg-white shadow rounded-xl p-6 text-center">
          <h3 className="text-md font-semibold">Approved</h3>
          <p className="text-3xl font-bold mt-2">02</p>
        </div>

        <div className="bg-white shadow rounded-xl p-6 text-center">
          <h3 className="text-md font-semibold">Pending</h3>
          <p className="text-3xl font-bold mt-2">03</p>
        </div>

        <div className="bg-white shadow rounded-xl p-6 text-center">
          <h3 className="text-md font-semibold">Queries</h3>
          <p className="text-3xl font-bold mt-2">01</p>
        </div>

      </section>


      {/* AI SCORE */}
      <section className="bg-white shadow rounded-xl p-6 mt-8 w-fit ml-auto">
        <h2 className="text-xl font-semibold mb-2 text-purple-700">🤖 AI Score</h2>
        <p className="text-4xl font-bold text-green-600">86%</p>
      </section>

    </div>

  </div>
);

  
   
  
};

export default InstitutionDashboard;
