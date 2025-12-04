import React, { useState } from "react";
import StepProgress from "../../../Components/StepProgress";
import {
  MessageSquare,
  Send,
  Paperclip,
  User,
  Bot,
  Search,
  Filter,
} from "lucide-react";

export default function ReviewAndQueryPage() {
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const queries = [
    {
      id: 1,
      title: "Missing Faculty Data",
      summary: "Please provide updated faculty details for the Engineering department...",
      date: "12 Jan 2025",
      status: "Pending",
      priority: "High",
      fullQuery:
        "UGC requests updated faculty data for the Engineering Department. Please upload the latest faculty list and qualifications for verification.",
      replies: [],
      category: "Faculty",
      assignedTo: "UGC Department",
    },
    {
      id: 2,
      title: "Document Verification Required",
      summary: "Upload latest Fire Safety Certificate issued this year...",
      date: "10 Jan 2025",
      status: "Responded",
      priority: "Medium",
      fullQuery:
        "Please upload the Fire Safety Certificate for the current academic year. Previous document is outdated.",
      replies: [
        {
          id: 1,
          text: "We have uploaded the renewed Fire Safety Certificate. Please verify.",
          time: "10 Jan 2025, 4:12 PM",
          sender: "Institution",
          attachments: ["fire_safety_certificate.pdf"],
        },
      ],
      category: "Infrastructure",
      assignedTo: "Safety Committee",
    },
  ];

  const statusColors = {
    Pending: "text-red-600 bg-red-50 border-red-200",
    Responded: "text-blue-600 bg-blue-50 border-blue-200",
    Closed: "text-green-600 bg-green-50 border-green-200",
  };

  const priorityColors = {
    High: "text-red-600 bg-red-50 border-red-200",
    Medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
    Low: "text-green-600 bg-green-50 border-green-200",
  };

  const handleReply = () => {
    if (!replyText.trim() || !selectedQuery) return;

    const newReply = {
      id: selectedQuery.replies.length + 1,
      text: replyText,
      time: new Date().toLocaleString("en-IN"),
      sender: "Institution",
      attachments: attachment ? [attachment.name] : [],
    };

    setSelectedQuery({
      ...selectedQuery,
      replies: [...selectedQuery.replies, newReply],
      status: "Responded",
    });

    setReplyText("");
    setAttachment(null);
  };

  const filteredQueries = queries.filter(
    (query) =>
      query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-start gap-8">
      <StepProgress currentStep={5} />

      <div className="max-w-7xl w-full">
        {/* HEADER */}
        <div className="bg-white rounded-xl shadow border p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Queries & Communication</h1>
              <p className="text-gray-600">
                View and reply to queries raised by UGC/AICTE
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search queries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg">
                <Filter size={18} />
                Filter
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* QUERY LIST */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Active Queries ({filteredQueries.length})
            </h3>

            {filteredQueries.map((query) => (
              <div
                key={query.id}
                onClick={() => setSelectedQuery(query)}
                className={`bg-white p-4 rounded-lg border-2 cursor-pointer hover:shadow ${
                  selectedQuery?.id === query.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex justify-between mb-2">
                  <h4 className="font-semibold">{query.title}</h4>
                  <span
                    className={`text-xs px-2 py-1 border rounded-full ${priorityColors[query.priority]}`}
                  >
                    {query.priority}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-2">
                  {query.summary}
                </p>

                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs px-2 py-1 border rounded-full ${statusColors[query.status]}`}
                  >
                    {query.status}
                  </span>
                  <span className="text-xs text-gray-500">{query.date}</span>
                </div>
              </div>
            ))}
          </div>

          {/* QUERY DETAILS */}
          <div className="lg:col-span-2 bg-white rounded-xl border p-6">
            {!selectedQuery ? (
              <div className="text-center py-12">
                <MessageSquare size={50} className="mx-auto text-gray-400" />
                <p className="mt-4 text-gray-600">
                  Select a query to view details
                </p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="border-b pb-4 mb-4">
                  <h2 className="text-xl font-semibold">
                    {selectedQuery.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedQuery.fullQuery}
                  </p>
                </div>

                {/* Conversation */}
                <div className="space-y-4 max-h-64 overflow-y-auto mb-6">
                  {selectedQuery.replies.length === 0 ? (
                    <p className="text-gray-500 text-center">
                      No replies yet
                    </p>
                  ) : (
                    selectedQuery.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className={`flex ${
                          reply.sender === "Institution"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div className="bg-gray-100 p-3 rounded-lg max-w-md">
                          <div className="flex items-center gap-2 mb-1">
                            {reply.sender === "Institution" ? (
                              <User size={14} />
                            ) : (
                              <Bot size={14} />
                            )}
                            <span className="text-xs text-gray-500">
                              {reply.sender} • {reply.time}
                            </span>
                          </div>
                          <p className="text-sm">{reply.text}</p>

                          {reply.attachments.length > 0 && (
                            <p className="text-xs mt-2 text-blue-600">
                              📎 {reply.attachments[0]}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Reply Box */}
                <div className="border-t pt-4 flex gap-3">
                  <label className="cursor-pointer">
                    <Paperclip />
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setAttachment(e.target.files[0])}
                    />
                  </label>

                  <input
                    type="text"
                    placeholder="Type your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 border rounded-lg px-4 py-2"
                  />

                  <button
                    onClick={handleReply}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Send size={16} /> Send
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
