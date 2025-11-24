import mongoose from "mongoose";

const aiAnalysisSchema = new mongoose.Schema({
  application_id: { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
  parameter_compliance_score: Number,
  document_completeness: Number,
  risk_score: Number,
  generated_at: { type: Date, default: Date.now }
});

const AIAnalysis = mongoose.model("AIAnalysis", aiAnalysisSchema);

export default AIAnalysis;
    