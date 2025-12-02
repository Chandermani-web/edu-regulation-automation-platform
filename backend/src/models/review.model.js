import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  application_id: { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
  reviewer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comments: String,
  status: { type: String, enum: ["accepted", "rejected", "changes_required"] },
  reviewed_at: { type: Date, default: Date.now }
});

reviewSchema.index({ application_id: 1, reviewer_id: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;