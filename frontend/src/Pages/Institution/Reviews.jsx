import React, { useState } from "react";
import Layout from "../../Components/Layout";
import StepProgress from "../../Components/StepProgress";
import {
  ChevronDown,
  ChevronUp,
  FileSearch,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

const Reviews = () => {
  const [open, setOpen] = useState(null);

  const reviews = [
    {
      id: 1,
      title: "Infrastructure",
      summary: "Laboratory space is adequate, but equipment list is outdated.",
      status: "Needs Improvement",
      statusColor: "text-red-600 bg-red-100",
      date: "14 Jan 2025",
      details: {
        feedback:
          "The laboratory area meets minimum UGC standards. However, several equipment items listed are outdated or missing.",
        corrections: [
          "Update list of lab equipment.",
          "Upload photos of working equipment.",
          "Submit a purchase plan for missing items.",
        ],
        suggestions: [
          "Upgrade Computer Lab with modern systems.",
          "Increase safety signage and display boards.",
        ],
      },
    },
    {
      id: 2,
      title: "Faculty",
      summary:
        "Faculty qualifications are appropriate. However, 5 positions are vacant.",
      status: "Satisfactory",
      statusColor: "text-blue-600 bg-blue-100",
      date: "10 Jan 2025",
      details: {
        feedback:
          "Most faculty members meet qualification norms. Vacancy positions must be filled within this semester.",
        corrections: ["Submit recruitment plan for open positions."],
        suggestions: ["Encourage faculty to publish more research papers."],
      },
    },
    {
      id: 3,
      title: "Financial Records",
      summary: "Financial audit statements verified and consistent.",
      status: "Good",
      statusColor: "text-green-700 bg-green-100",
      date: "07 Jan 2025",
      details: {
        feedback:
          "Audit statements follow UGC guidelines. No discrepancies found.",
        corrections: [],
        suggestions: ["Continue maintaining transparent financial reporting."],
      },
    },
  ];

  return (
    <Layout showNavbar={false}>
      <StepProgress currentStep={6} />

      <div className="w-full p-10">
      
        <p className="text-gray-600 mb-6">
          These reviews are provided after verification of your data and
          documents.
        </p>

        <div className="grid grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white shadow rounded-xl p-6 border"
            >
              {/* HEADER */}
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() =>
                  setOpen(open === review.id ? null : review.id)
                }
              >
                <div>
                  <h2 className="text-xl font-bold">{review.title}</h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {review.summary}
                  </p>
                </div>

                {open === review.id ? (
                  <ChevronUp className="text-gray-500" />
                ) : (
                  <ChevronDown className="text-gray-500" />
                )}
              </div>

              {/* STATUS & DATE */}
              <div className="flex justify-between items-center mt-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${review.statusColor}`}
                >
                  {review.status}
                </span>
                <span className="text-gray-500 text-sm">{review.date}</span>
              </div>

              {/* EXPANDED DETAILS */}
              {open === review.id && (
                <div className="mt-6 space-y-6 border-t pt-4">
                  {/* FEEDBACK */}
                  <div>
                    <h3 className="font-semibold flex items-center gap-2 text-gray-800">
                      <FileSearch size={18} /> Detailed Feedback
                    </h3>
                    <p className="text-gray-700 mt-2">
                      {review.details.feedback}
                    </p>
                  </div>

                  {/* REQUIRED CORRECTIONS */}
                  {review.details.corrections.length > 0 && (
                    <div>
                      <h3 className="font-semibold flex items-center gap-2 text-gray-800">
                        <AlertTriangle size={18} /> Required Corrections
                      </h3>
                      <ul className="list-disc ml-6 mt-2 text-gray-700">
                        {review.details.corrections.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* SUGGESTIONS */}
                  <div>
                    <h3 className="font-semibold flex items-center gap-2 text-gray-800">
                      <CheckCircle2 size={18} /> Suggestions
                    </h3>
                    <ul className="list-disc ml-6 mt-2 text-gray-700">
                      {review.details.suggestions.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-xs text-gray-500 italic">
                    *This review is read-only. You cannot modify UGC/AICTE
                    evaluations.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Reviews;
