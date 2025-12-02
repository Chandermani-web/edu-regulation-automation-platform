import React, { useState } from "react";
import StepProgress from "../../Components/StepProgress";
import {
  MessageSquare,
  Send,
  Paperclip,
  ChevronDown,
  ChevronUp,
  FileSearch,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Bot,
  Download,
  Eye,
  Filter,
  Search,
  Bell
} from "lucide-react";

export default function ReviewAndQueryPage() {
  const [activeTab, setActiveTab] = useState("queries");
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [openReview, setOpenReview] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const queries = [
    {
      id: 1,
      title: "Missing Faculty Data",
      summary: "Please provide updated faculty details for the Engineering department...",
      date: "12 Jan 2025",
      status: "Pending",
      priority: "High",
      fullQuery: "UGC requests updated faculty data for the Engineering Department. Please upload the latest faculty list and qualifications for verification. Ensure all faculty members have updated appointment letters and qualification certificates.",
      replies: [],
      category: "Faculty",
      assignedTo: "UGC Department"
    },
    {
      id: 2,
      title: "Document Verification Required",
      summary: "Upload latest Fire Safety Certificate issued this year...",
      date: "10 Jan 2025",
      status: "Responded",
      priority: "Medium",
      fullQuery: "Please upload the Fire Safety Certificate for the current academic year. Previous document is outdated and needs renewal as per UGC safety compliance standards.",
      replies: [
        {
          id: 1,
          text: "We have uploaded the renewed Fire Safety Certificate. Please verify at your earliest convenience.",
          time: "10 Jan 2025, 4:12 PM",
          sender: "Institution",
          attachments: ["fire_safety_certificate.pdf"]
        },
      ],
      category: "Infrastructure",
      assignedTo: "Safety Committee"
    },
    {
      id: 3,
      title: "Clarify Infrastructure Details",
      summary: "Uploaded floor plan mismatch with declared lab area...",
      date: "05 Jan 2025",
      status: "Closed",
      priority: "High",
      fullQuery: "UGC noticed a significant mismatch in the laboratory floor area measurements. The declared area in parameters is 1500 sq ft while the uploaded floor plan shows 3500 sq ft. Please reconfirm and provide accurate data.",
      replies: [
        {
          id: 1,
          text: "We have corrected the laboratory area details and submitted the accurate measurements.",
          time: "05 Jan 2025, 11:40 AM",
          sender: "Institution",
          attachments: ["updated_floor_plan.pdf"]
        },
        {
          id: 2,
          text: "Verified and accepted. The correction has been processed successfully.",
          time: "06 Jan 2025, 09:10 AM",
          sender: "UGC Reviewer",
          attachments: []
        },
      ],
      category: "Infrastructure",
      assignedTo: "Infrastructure Team"
    },
  ];

  const reviews = [
    {
      id: 1,
      title: "Infrastructure Compliance",
      summary: "Laboratory space is adequate, but equipment list requires updating.",
      status: "Needs Improvement",
      statusColor: "text-red-600 bg-red-50 border-red-200",
      date: "14 Jan 2025",
      reviewer: "UGC Infrastructure Team",
      score: 65,
      details: {
        feedback: "The laboratory area meets minimum UGC standards. However, several equipment items listed are outdated or missing verification. The computer lab requires modernization to meet current educational standards.",
        strengths: [
          "Adequate laboratory space allocation",
          "Proper safety equipment available",
          "Good maintenance records"
        ],
        corrections: [
          "Update list of lab equipment with current specifications",
          "Upload recent photos of working equipment",
          "Submit equipment purchase and upgrade plan",
          "Provide equipment maintenance schedules"
        ],
        suggestions: [
          "Upgrade Computer Lab with modern systems",
          "Increase safety signage and display boards",
          "Consider implementing digital lab management system"
        ],
        deadline: "28 Feb 2025"
      },
    },
    {
      id: 2,
      title: "Faculty Qualifications",
      summary: "Faculty qualifications are appropriate but vacancies need filling.",
      status: "Satisfactory",
      statusColor: "text-blue-600 bg-blue-50 border-blue-200",
      date: "10 Jan 2025",
      reviewer: "UGC Academic Committee",
      score: 78,
      details: {
        feedback: "Most faculty members meet qualification norms with appropriate degrees and experience. However, 5 teaching positions remain vacant which affects student-teacher ratio compliance.",
        strengths: [
          "Qualified senior faculty members",
          "Good faculty retention rate",
          "Adequate research publications"
        ],
        corrections: [
          "Submit recruitment plan for vacant positions",
          "Provide timeline for faculty appointments",
          "Update faculty database with current information"
        ],
        suggestions: [
          "Encourage faculty to publish more research papers",
          "Provide professional development opportunities",
          "Consider visiting faculty for specialized courses"
        ],
        deadline: "15 Mar 2025"
      },
    },
    {
      id: 3,
      title: "Financial Records Audit",
      summary: "Financial audit statements verified and consistent with standards.",
      status: "Excellent",
      statusColor: "text-green-600 bg-green-50 border-green-200",
      date: "07 Jan 2025",
      reviewer: "UGC Finance Committee",
      score: 92,
      details: {
        feedback: "Financial audit statements follow UGC guidelines perfectly. No discrepancies found in financial reporting. All transactions are properly documented and transparent.",
        strengths: [
          "Complete and accurate financial records",
          "Timely audit submissions",
          "Transparent financial reporting",
          "Proper fund utilization"
        ],
        corrections: [],
        suggestions: [
          "Continue maintaining transparent financial reporting",
          "Consider digital financial management system",
          "Regular internal audit mechanisms"
        ],
        deadline: "N/A"
      },
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
    if (!replyText.trim()) return;
    
    const newReply = {
      id: selectedQuery.replies.length + 1,
      text: replyText,
      time: new Date().toLocaleString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      sender: "Institution",
      attachments: attachment ? [attachment.name] : []
    };

    // Update the query with new reply
    const updatedQueries = queries.map(q => 
      q.id === selectedQuery.id 
        ? { ...q, replies: [...q.replies, newReply], status: "Responded" }
        : q
    );
    
    setSelectedQuery({...selectedQuery, replies: [...selectedQuery.replies, newReply], status: "Responded"});
    setReplyText("");
    setAttachment(null);
  };

  const filteredQueries = queries.filter(query =>
    query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    query.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    query.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReviews = reviews.filter(review =>
    review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-start gap-8">
      <StepProgress currentStep={4} />

      <div className="max-w-7xl w-full">
        {/* HEADER SECTION */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Reviews & Queries</h1>
              <p className="text-gray-600">
                Manage UGC/AICTE communications, respond to queries, and review compliance feedback
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search queries or reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter size={18} />
                Filter
              </button>
            </div>
          </div>

          {/* TAB NAVIGATION */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("queries")}
              className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === "queries"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <MessageSquare size={20} />
              Queries & Communications
              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                {queries.filter(q => q.status !== "Closed").length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === "reviews"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <FileSearch size={20} />
              Compliance Reviews
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                {reviews.length}
              </span>
            </button>
          </div>
        </div>

        {/* QUERIES TAB */}
        {activeTab === "queries" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* QUERY LIST */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Active Queries</h3>
                <span className="text-sm text-gray-500">
                  {filteredQueries.length} queries
                </span>
              </div>
              
              <div className="space-y-3">
                {filteredQueries.map((query) => (
                  <div
                    key={query.id}
                    onClick={() => setSelectedQuery(query)}
                    className={`bg-white p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                      selectedQuery?.id === query.id 
                        ? "border-blue-500 bg-blue-50" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{query.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[query.priority]}`}>
                        {query.priority}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{query.summary}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[query.status]}`}>
                          {query.status}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {query.category}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{query.date}</span>
                    </div>
                    
                    {query.replies.length > 0 && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                        <MessageSquare size={12} />
                        {query.replies.length} response{query.replies.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* QUERY DETAILS */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {!selectedQuery ? (
                  <div className="text-center py-12">
                    <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Query</h3>
                    <p className="text-gray-500">Choose a query from the list to view details and respond</p>
                  </div>
                ) : (
                  <>
                    {/* QUERY HEADER */}
                    <div className="border-b border-gray-200 pb-4 mb-6">
                      <div className="flex items-start justify-between mb-3">
                        <h2 className="text-xl font-semibold text-gray-900">{selectedQuery.title}</h2>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[selectedQuery.status]}`}>
                            {selectedQuery.status}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${priorityColors[selectedQuery.priority]}`}>
                            {selectedQuery.priority}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Category:</span> {selectedQuery.category}
                        </div>
                        <div>
                          <span className="font-medium">Assigned To:</span> {selectedQuery.assignedTo}
                        </div>
                        <div>
                          <span className="font-medium">Date Raised:</span> {selectedQuery.date}
                        </div>
                        <div>
                          <span className="font-medium">Responses:</span> {selectedQuery.replies.length}
                        </div>
                      </div>
                    </div>

                    {/* QUERY CONTENT */}
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 mb-3">Query Details</h3>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-gray-700">{selectedQuery.fullQuery}</p>
                      </div>
                    </div>

                    {/* CONVERSATION */}
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 mb-3">Conversation History</h3>
                      <div className="space-y-4 max-h-80 overflow-y-auto">
                        {selectedQuery.replies.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <MessageSquare size={32} className="mx-auto mb-2" />
                            <p>No responses yet. Be the first to respond.</p>
                          </div>
                        ) : (
                          selectedQuery.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className={`flex gap-3 ${reply.sender === "Institution" ? "justify-end" : "justify-start"}`}
                            >
                              {reply.sender !== "Institution" && (
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <Bot size={16} className="text-blue-600" />
                                </div>
                              )}
                              <div
                                className={`max-w-[80%] rounded-2xl p-4 ${
                                  reply.sender === "Institution"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-900"
                                }`}
                              >
                                <p className="text-sm">{reply.text}</p>
                                {reply.attachments.length > 0 && (
                                  <div className="mt-2">
                                    {reply.attachments.map((file, index) => (
                                      <div key={index} className="flex items-center gap-1 text-xs opacity-80">
                                        <Paperclip size={12} />
                                        {file}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <div className={`text-xs mt-2 ${
                                  reply.sender === "Institution" ? "text-blue-200" : "text-gray-500"
                                }`}>
                                  {reply.time} • {reply.sender}
                                </div>
                              </div>
                              {reply.sender === "Institution" && (
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <User size={16} className="text-gray-600" />
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* REPLY SECTION */}
                    {selectedQuery.status !== "Closed" && (
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Your Response</h3>
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                          placeholder="Type your response to the query..."
                        />
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            <label className="cursor-pointer flex items-center gap-2 text-blue-600 font-medium text-sm">
                              <Paperclip size={16} />
                              Attach File
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => setAttachment(e.target.files[0])}
                              />
                            </label>
                            {attachment && (
                              <span className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded">
                                {attachment.name}
                              </span>
                            )}
                          </div>
                          
                          <button
                            onClick={handleReply}
                            disabled={!replyText.trim()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            <Send size={16} />
                            Submit Response
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div
                    className="flex justify-between items-start cursor-pointer"
                    onClick={() => setOpenReview(openReview === review.id ? null : review.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-semibold text-gray-900">{review.title}</h2>
                        <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                          <span className="text-sm font-medium text-gray-700">{review.score}%</span>
                        </div>
                      </div>
                      <p className="text-gray-600">{review.summary}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {openReview === review.id ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${review.statusColor}`}>
                        {review.status}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {review.reviewer}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>

                  {openReview === review.id && (
                    <div className="mt-6 space-y-6 border-t border-gray-200 pt-6">
                      {/* FEEDBACK */}
                      <div>
                        <h3 className="font-semibold flex items-center gap-2 text-gray-900 mb-3">
                          <FileSearch size={18} />
                          Detailed Feedback
                        </h3>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-gray-700">{review.details.feedback}</p>
                        </div>
                      </div>

                      {/* STRENGTHS */}
                      {review.details.strengths.length > 0 && (
                        <div>
                          <h3 className="font-semibold flex items-center gap-2 text-green-700 mb-3">
                            <CheckCircle2 size={18} />
                            Strengths
                          </h3>
                          <ul className="space-y-2">
                            {review.details.strengths.map((strength, i) => (
                              <li key={i} className="flex items-center gap-2 text-gray-700">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* CORRECTIONS */}
                      {review.details.corrections.length > 0 && (
                        <div>
                          <h3 className="font-semibold flex items-center gap-2 text-red-700 mb-3">
                            <AlertTriangle size={18} />
                            Required Corrections
                          </h3>
                          <ul className="space-y-2">
                            {review.details.corrections.map((correction, i) => (
                              <li key={i} className="flex items-center gap-2 text-gray-700">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                {correction}
                              </li>
                            ))}
                          </ul>
                          {review.details.deadline && review.details.deadline !== "N/A" && (
                            <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
                              <Clock size={14} />
                              <span className="font-medium">Deadline: {review.details.deadline}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* SUGGESTIONS */}
                      {review.details.suggestions.length > 0 && (
                        <div>
                          <h3 className="font-semibold flex items-center gap-2 text-blue-700 mb-3">
                            <CheckCircle2 size={18} />
                            Improvement Suggestions
                          </h3>
                          <ul className="space-y-2">
                            {review.details.suggestions.map((suggestion, i) => (
                              <li key={i} className="flex items-center gap-2 text-gray-700">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 italic">
                          This review is provided by UGC/AICTE for compliance improvement.
                        </p>
                        <button className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <Download size={14} />
                          Export
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}