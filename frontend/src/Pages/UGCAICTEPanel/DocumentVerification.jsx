import React from "react";
import UGCLayout from "../../Components/UGCLayout";
import { Eye, CheckCircle, RefreshCcw, ShieldCheck, FileSearch } from "lucide-react";

const DocumentVerification = () => {
  return (
    <UGCLayout showNavbar={false}>
      <div className="p-6 space-y-10">

        {/* PAGE TITLE */}
        <h1 className="text-2xl font-bold text-gray-800">Document Verification</h1>

        {/* DOCUMENT PREVIEW SECTION */}
        <section className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Preview Document</h2>

          <div className="w-full h-72 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
            <Eye size={40} />  
            <span className="ml-3">Document Preview Here</span>
          </div>
        </section>

        {/* AUTHENTICITY CHECK */}
        <section className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Authenticity Check</h2>

          <div className="flex items-center gap-4">
            <ShieldCheck className="text-green-600" size={30} />
            <p className="text-gray-600 font-medium">AI Scan: Document appears authentic</p>
          </div>

          <div className="flex items-center gap-4">
            <FileSearch className="text-blue-600" size={30} />
            <p className="text-gray-600 font-medium">Metadata Verified: Matching institution details</p>
          </div>
        </section>

        {/* REMARK BOX */}
        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-gray-700">Add Remarks</h2>

          <textarea
            className="w-full p-4 mt-3 border rounded-lg h-28 focus:outline-blue-500"
            placeholder="Write your remarks here..."
          ></textarea>
        </section>

        {/* OLD VS NEW VERSION */}
        <section className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Compare Old vs New Version</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* OLD VERSION */}
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="font-semibold text-gray-700 mb-2">Old Document</p>
              <div className="h-48 bg-gray-300 rounded-lg flex items-center justify-center text-gray-500">
                <Eye size={30} />
              </div>
            </div>

            {/* NEW VERSION */}
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="font-semibold text-gray-700 mb-2">New Document</p>
              <div className="h-48 bg-gray-300 rounded-lg flex items-center justify-center text-gray-500">
                <Eye size={30} />
              </div>
            </div>

          </div>
        </section>

        {/* ACTION BUTTONS */}
        <div className="flex gap-4 justify-end">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2">
            <CheckCircle size={18} /> Verify
          </button>

          <button className="px-6 py-2 bg-yellow-500 text-white rounded-lg flex items-center gap-2">
            <RefreshCcw size={18} /> Request Re-upload
          </button>
        </div>

      </div>
    </UGCLayout>
  );
};

export default DocumentVerification;
