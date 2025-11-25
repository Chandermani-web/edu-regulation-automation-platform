import React, { useState } from "react";
import Sidebar from "../../Components/Sidebar";

const Queries = () => {
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [file, setFile] = useState(null);

  // Dummy data (Replace with backend API)
  const queries = [
    {
      id: 1,
      title: "Missing Faculty Data",
      message: "Please provide updated faculty details for the Engineering department.",
      status: "Pending",
      date: "12 Jan 2025",
    },
    {
      id: 2,
      title: "Document Verification Required",
      message: "Upload latest Fire Safety Certificate issued this year.",
      status: "Responded",
      date: "10 Jan 2025",
    },
    {
      id: 3,
      title: "Clarify Infrastructure Details",
      message: "Square footage for labs does not match uploaded floor plan. Please verify.",
      status: "Closed",
      date: "05 Jan 2025",
    },
  ];

  const handleReplySubmit = (e) => {
    e.preventDefault();
    alert("Reply submitted successfully!");

    setReplyText("");
    setFile(null);
    setSelectedQuery(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-col w-full p-8">
        <h1 className="text-2xl font-bold mb-6">Queries</h1>
        <p className="text-gray-600 mb-5">
          Here you can view, respond, and track all queries raised by UGC/AICTE.
        </p>

        {/* Query List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {queries.map((q) => (
            <div
              key={q.id}
              className="bg-white p-5 shadow rounded cursor-pointer hover:shadow-lg transition"
              onClick={() => setSelectedQuery(q)}
            >
              <h2 className="font-bold text-lg">{q.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{q.message.slice(0, 60)}...</p>

              <div className="flex justify-between items-center mt-4">
                <span
                  className={`text-sm font-semibold ${
                    q.status === "Pending"
                      ? "text-red-500"
                      : q.status === "Responded"
                      ? "text-blue-500"
                      : "text-green-600"
                  }`}
                >
                  {q.status}
                </span>
                <span className="text-xs text-gray-400">{q.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed View */}
        {selectedQuery && (
          <div className="mt-8 bg-white shadow p-6 rounded">
            <div className="flex justify-between">
              <h2 className="text-xl font-bold">{selectedQuery.title}</h2>
              <button
                className="text-red-500 font-bold"
                onClick={() => setSelectedQuery(null)}
              >
                ✕ Close
              </button>
            </div>

            <p className="text-gray-700 mt-3">{selectedQuery.message}</p>
            <p className="text-sm text-gray-500 mt-1">Date: {selectedQuery.date}</p>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Reply to Query</h3>
              <form onSubmit={handleReplySubmit} className="space-y-4">
                <textarea
                  className="w-full border p-3 rounded h-28"
                  placeholder="Write your reply here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  required
                />

                <input
                  type="file"
                  className="w-full border p-2 rounded"
                  onChange={(e) => setFile(e.target.files[0])}
                />

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  Submit Reply
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Queries;
