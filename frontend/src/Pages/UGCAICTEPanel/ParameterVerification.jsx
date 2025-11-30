import React from "react";
import UGCLayout from "../../Components/UGCLayout";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

const ParameterVerification = () => {
  const parameters = [
    { name: "Faculty Qualification", status: "Pending" },
    { name: "Infrastructure & Labs", status: "Pending" },
   
    { name: "Placement Records", status: "Pending" },
    { name: "Student Enrollment Ratio", status: "Pending" },
  ];

  return (
    <UGCLayout showNavbar={false}>
      <div className="p-6 space-y-8">

        {/* PAGE TITLE */}
        <h1 className="text-2xl font-bold text-gray-800">
          Parameter Verification
        </h1>

        <p className="text-gray-600">
          Each metric is checked manually by UGC/AICTE reviewer.
        </p>

        {/* PARAMETER LIST */}
        <div className="space-y-4">
          {parameters.map((item, index) => (
            <div
              key={index}
              className="bg-white p-5 shadow rounded-xl flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-700">
                  {item.name}
                </h2>
                <p className="text-gray-500 text-sm">Status: {item.status}</p>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3">
                <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition">
                  <CheckCircle size={18} /> Verified
                </button>

                <button className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-600 transition">
                  <AlertTriangle size={18} /> Needs Correction
                </button>

                <button className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition">
                  <XCircle size={18} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </UGCLayout>
  );
};

export default ParameterVerification;
