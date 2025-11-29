import React, { useState } from "react";
import Layout from "../../Components/Layout"; // ✅ Use Layout instead of manual sidebar
import StepProgress from "../../Components/StepProgress";
import {
  MessageSquareWarning,
  Send,
  Paperclip,
} from "lucide-react";

const Queries = () => {
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [attachment, setAttachment] = useState(null);

  const queries = [
    {
      id: 1,
      title: "Missing Faculty Data",
      summary:
        "Please provide updated faculty details for the Engineering department...",
      date: "12 Jan 2025",
      status: "Pending",
      fullQuery:
        "UGC requests updated faculty data for the Engineering Department. Please upload the latest faculty list and qualifications.",
      replies: [],
    },
    {
      id: 2,
      title: "Document Verification Required",
      summary: "Upload latest Fire Safety Certificate issued this year...",
      date: "10 Jan 2025",
      status: "Responded",
      fullQuery:
        "Please upload the Fire Safety Certificate for the current academic year. Previous document is outdated.",
      replies: [
        {
          text: "We have uploaded the certificate. Please verify.",
          time: "10 Jan 2025, 4:12 PM",
        },
      ],
    },
    {
      id: 3,
      title: "Clarify Infrastructure Details",
      summary: "Uploaded floor plan mismatch with declared lab area...",
      date: "05 Jan 2025",
      status: "Closed",
      fullQuery:
        "UGC noticed a mismatch in the lab floor area. Please reconfirm the data.",
      replies: [
        {
          text: "Updated lab area details submitted.",
          time: "05 Jan 2025, 11:40 AM",
        },
        {
          text: "Verified & accepted.",
          time: "06 Jan 2025, 09:10 AM",
        },
      ],
    },
  ];

  const statusColors = {
    Pending: "text-red-600 bg-red-100",
    Responded: "text-blue-600 bg-blue-100",
    Closed: "text-green-700 bg-green-100",
  };

  const handleReply = () => {
    if (!replyText.trim()) return;

    setReplyText("");
    alert("Reply submitted!");
  };

  return (
    <Layout showNavbar={false}>
      <StepProgress currentStep={5} />

     
      <p className="text-gray-600 mb-6">
        View, reply, and track all queries raised by UGC/AICTE.
      </p>

      <div className="grid grid-cols-2 gap-6">
        {/* ------------------ QUERY LIST ------------------ */}
        <div className="space-y-4">
          {queries.map((q) => (
            <div
              key={q.id}
              onClick={() => setSelectedQuery(q)}
              className="bg-white cursor-pointer p-5 rounded-xl shadow hover:shadow-md transition border"
            >
              <h3 className="text-lg font-semibold">{q.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{q.summary}</p>

              <div className="flex justify-between items-center mt-4">
                <span
                  className={`px-3 py-1 text-sm rounded-full font-medium ${statusColors[q.status]}`}
                >
                  {q.status}
                </span>
                <span className="text-gray-500 text-sm">{q.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ------------------ QUERY DETAILS PANEL ------------------ */}
        <div className="bg-white p-6 rounded-xl shadow-xl min-h-[500px]">
          {!selectedQuery ? (
            <div className="text-center text-gray-500 mt-20">
              <MessageSquareWarning className="mx-auto mb-4" size={50} />
              <p>Select a query to view details</p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-2">{selectedQuery.title}</h2>
              <p className="text-gray-700">{selectedQuery.fullQuery}</p>

              <div className="mt-4">
                <span
                  className={`px-4 py-1 rounded-full text-sm font-semibold ${statusColors[selectedQuery.status]}`}
                >
                  {selectedQuery.status}
                </span>
              </div>

              {/* Replies / Conversation */}
              <h3 className="mt-6 font-semibold text-gray-700">Conversation</h3>
              <div className="space-y-3 mt-3 max-h-56 overflow-y-auto border p-4 rounded-lg bg-gray-50">
                {selectedQuery.replies.length === 0 ? (
                  <p className="text-gray-500 text-sm">No replies yet.</p>
                ) : (
                  selectedQuery.replies.map((r, i) => (
                    <div
                      key={i}
                      className="bg-white p-3 rounded-lg shadow border"
                    >
                      <p>{r.text}</p>
                      <p className="text-sm text-gray-500 mt-1">{r.time}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Reply Box */}
              {selectedQuery.status !== "Closed" && (
                <div className="mt-6">
                  <label className="font-semibold text-gray-700">
                    Your Reply
                  </label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full border p-3 rounded-lg mt-2 h-24"
                    placeholder="Type your response..."
                  />

                  {/* File Upload */}
                  <div className="mt-3 flex items-center gap-3">
                    <label className="cursor-pointer flex items-center gap-2 text-blue-600 font-semibold">
                      <Paperclip size={18} />
                      Attach File
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => setAttachment(e.target.files[0])}
                      />
                    </label>

                    {attachment && (
                      <span className="text-sm text-gray-700">
                        {attachment.name}
                      </span>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleReply}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 mt-4"
                  >
                    <Send size={18} /> Submit Reply
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Queries;
