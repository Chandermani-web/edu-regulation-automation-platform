import React, { useState } from "react";
import UGCLayout from "../../Components/UGCLayout";
import { MessageSquarePlus, Paperclip, Send, ChevronDown } from "lucide-react";

const QueryManagement = () => {
  const [openNewQuery, setOpenNewQuery] = useState(false);

  return (
    <UGCLayout showNavbar={false}>

      <div className="p-6 space-y-10">

        {/* ---------- PAGE TITLE ---------- */}
        <h1 className="text-2xl font-bold text-gray-800">Query Management</h1>

        {/* ---------- CREATE NEW QUERY BOX ---------- */}
        <section className="bg-white p-6 rounded-xl shadow">
          <div
            onClick={() => setOpenNewQuery(!openNewQuery)}
            className="flex justify-between items-center cursor-pointer"
          >
            <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
              <MessageSquarePlus size={22} /> Create New Query
            </h2>
            <ChevronDown
              size={20}
              className={`text-gray-700 transition ${
                openNewQuery ? "rotate-180" : ""
              }`}
            />
          </div>

          {openNewQuery && (
            <div className="mt-6 space-y-5">

              {/* Query Textarea */}
              <textarea
                className="w-full p-4 border rounded-lg outline-none"
                rows={4}
                placeholder="Write your query here..."
              ></textarea>

              {/* File Attachment */}
              <label className="flex items-center gap-3 cursor-pointer">
                <Paperclip size={18} />
                <span className="text-gray-700">Attach Reference Documents</span>
                <input type="file" className="hidden" />
              </label>

              {/* Action Button */}
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
                <Send size={18} /> Send Query
              </button>
            </div>
          )}
        </section>

        {/* ---------- EXISTING QUERIES LIST ---------- */}
        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Existing Queries</h2>

          <div className="space-y-4">

            {/* Sample Query 1 */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="font-medium text-gray-800">
                Request: Please upload updated faculty qualification documents.
              </p>
              <p className="text-sm text-gray-500 mt-1">Status: Awaiting Reply</p>

              <div className="mt-3 ml-4 border-l-2 border-gray-400 pl-3">
                <p className="text-gray-700 text-sm">
                  📌 Institution Reply: "We are preparing updated documents."
                </p>
              </div>
            </div>

            {/* Sample Query 2 */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="font-medium text-gray-800">
                Request: Data correction needed for infrastructure details.
              </p>
              <p className="text-sm text-gray-500 mt-1 text-green-600">
                Status: Replied
              </p>

              <div className="mt-3 ml-4 border-l-2 border-green-600 pl-3">
                <p className="text-gray-700 text-sm">
                  📌 Institution Reply: "Corrected infrastructure details uploaded."
                </p>
              </div>
            </div>

          </div>
        </section>
      </div>

    </UGCLayout>
  );
};

export default QueryManagement;
