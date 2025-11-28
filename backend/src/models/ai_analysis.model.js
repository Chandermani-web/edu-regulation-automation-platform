import mongoose from "mongoose";

const aiAnalysisSchema = new mongoose.Schema({
  application_id: { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
  parameter_compliance_score: Number,
  analyzed_by: {
    type: String, // e.g. 'institution', 'ugc', 'aicte', 'system'
    default: 'system'
  },
  input_data: {
    type: mongoose.Schema.Types.Mixed // store whatever you sent to Python (text, meta, etc.)
  },
  ai_output: {
    type: mongoose.Schema.Types.Mixed // JSON result from Python
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'completed', 'failed'],
    default: 'pending',
    index: true
  },
  error: {
    type: String,
    default: null
  },
  run_count: {
    type: Number,
    default: 0
  },
  run_at: {
    type: Date
  }
},{ timestamps: true });

const AIAnalysis = mongoose.model("AIAnalysis", aiAnalysisSchema);

export default AIAnalysis;
    