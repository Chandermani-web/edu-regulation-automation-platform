import React, { useState } from "react";
import Sidebar from "../../Components/Sidebar";

const Reviews = () => {
  const [selectedReview, setSelectedReview] = useState(null);

  // Dummy review data — replace with backend API later
  const reviews = [
    {
      id: 1,
      section: "Infrastructure",
      comment: "The laboratory space is adequate, but equipment list is outdated. Upgrade recommended.",
      rating: "Needs Improvement",
      date: "14 Jan 2025",
    },
    {
      id: 2,
      section: "Faculty",
      comment: "Faculty qualifications are appropriate. However, 5 positions are vacant. Recruit immediately.",
      rating: "Satisfactory",
      date: "10 Jan 2025",
    },
    {
      id: 3,
      section: "Financial Records",
      comment: "Financial audit statements are verified and consistent with previous years.",
      rating: "Good",
      date: "07 Jan 2025",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="w-full p-8">
        <h1 className="text-2xl font-bold mb-6">UGC / AICTE Reviews</h1>
        <p className="text-gray-600 mb-5">
          These reviews are provided by UGC/AICTE after verification of your data and documents.
        </p>

        {/* Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-white p-5 shadow rounded hover:shadow-lg cursor-pointer transition"
              onClick={() => setSelectedReview(r)}
            >
              <h2 className="text-lg font-bold">{r.section}</h2>
              <p className="text-sm text-gray-500 mt-1">{r.comment.slice(0, 60)}...</p>

              <div className="flex justify-between items-center mt-3">
                <span
                  className={`text-sm font-semibold ${
                    r.rating === "Good"
                      ? "text-green-600"
                      : r.rating === "Satisfactory"
                      ? "text-blue-500"
                      : "text-red-500"
                  }`}
                >
                  {r.rating}
                </span>
                <span className="text-xs text-gray-400">{r.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Review Details Modal */}
        {selectedReview && (
          <div className="mt-8 bg-white shadow p-6 rounded">
            <div className="flex justify-between">
              <h2 className="text-xl font-bold">{selectedReview.section}</h2>
              <button
                className="text-red-600 font-bold"
                onClick={() => setSelectedReview(null)}
              >
                ✕ Close
              </button>
            </div>

            <p className="text-gray-700 mt-4">{selectedReview.comment}</p>

            <div className="mt-4">
              <span
                className={`px-3 py-1 rounded text-white font-semibold ${
                  selectedReview.rating === "Good"
                    ? "bg-green-600"
                    : selectedReview.rating === "Satisfactory"
                    ? "bg-blue-600"
                    : "bg-red-600"
                }`}
              >
                {selectedReview.rating}
              </span>
            </div>

            <p className="text-sm text-gray-500 mt-3">
              Reviewed on: {selectedReview.date}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
