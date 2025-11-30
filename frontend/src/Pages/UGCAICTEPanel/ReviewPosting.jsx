import React from "react";
import UGCLayout from "../../Components/UGCLayout";

const ReviewPosting = () => {
  return (
    <UGCLayout showNavbar={false}>
      <div className="p-6 space-y-8">

        {/* PAGE TITLE */}
        <h1 className="text-2xl font-bold text-gray-800">Review Posting</h1>

        {/* SECTION-WISE COMMENTS */}
        <section className="bg-white p-6 shadow rounded-xl space-y-3">
          <h2 className="text-xl font-semibold text-gray-700">Section-wise Comments</h2>

          <textarea
            className="w-full p-4 h-40 border rounded-lg focus:ring focus:ring-blue-300"
            placeholder="Write section-wise comments here..."
          ></textarea>
        </section>

        {/* DETAILED OBSERVATIONS */}
        <section className="bg-white p-6 shadow rounded-xl space-y-3">
          <h2 className="text-xl font-semibold text-gray-700">Detailed Observations</h2>

          <textarea
            className="w-full p-4 h-40 border rounded-lg focus:ring focus:ring-blue-300"
            placeholder="Write detailed observations about the institution..."
          ></textarea>
        </section>

        {/* IMPROVEMENT REQUIRED NOTES */}
        <section className="bg-white p-6 shadow rounded-xl space-y-3">
          <h2 className="text-xl font-semibold text-gray-700">Improvement Required Notes</h2>

          <textarea
            className="w-full p-4 h-32 border rounded-lg focus:ring focus:ring-blue-300"
            placeholder="Mention required improvements for this institution..."
          ></textarea>
        </section>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end">
          <button
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Submit Review
          </button>
        </div>

      </div>
    </UGCLayout>
  );
};

export default ReviewPosting;
