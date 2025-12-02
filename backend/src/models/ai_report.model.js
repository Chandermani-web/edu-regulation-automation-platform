import mongoose from "mongoose";

const aiReportSchema = new mongoose.Schema({
  application_id: { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
  ai_analysis_id: { type: mongoose.Schema.Types.ObjectId, ref: "AIAnalysis" },
  report_title: String,
  report_url: String,
  created_at: { type: Date, default: Date.now }
});

const AIReport = mongoose.model("AIReport", aiReportSchema);

export default AIReport;