import mongoose from "mongoose";

/* Institution Details Subschema */
const institutionDetailsSchema = new mongoose.Schema({
  name: String,
  category: String,
  head_title: String,
  head_name: String,
  corpus_fund: String,
  students: String,
  faculty: String,
  faculty_ratio: String,
  admin_area: String,
  computers: String
}, { _id: false });

/* Visual Detection Subschema */
const visualDetectionSchema = new mongoose.Schema({
  Classroom: { type: String, default: "missing" },
  Library: { type: String, default: "missing" },
  Laboratory: { type: String, default: "missing" },
  College_Building: { type: String, default: "missing" }
}, { _id: false });

/* Scores Subschema */
const scoresSchema = new mongoose.Schema({
  financial_score: { type: Number, default: 0 },
  faculty_score: { type: Number, default: 0 },
  infra_score: { type: Number, default: 0 },
  visual_score: { type: Number, default: 0 },
  total_score: { type: Number, default: 0 }
}, { _id: false });

/* Final Decision Subschema */
const finalDecisionSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["Approved", "Rejected", "Pending"],
    default: "Pending"
  },
  reasons: {
    type: [String],
    default: []
  }
}, { _id: false });


/* MAIN SCHEMA */
const aiAnalysisSchema = new mongoose.Schema({

  institution_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institution",
    required: true,
    index: true
  },

  application_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    required: true,
    index: true
  },

  analyzed_by: {
    type: String,
    enum: ["institution", "ugc", "aicte", "system"],
    default: "system",
    index: true
  },

  /* Raw input data sent to AI */
  input_data: {
    type: mongoose.Schema.Types.Mixed
  },

  /* Full raw AI output (backup & logs) */
  ai_output: {
    type: mongoose.Schema.Types.Mixed
  },

  /* Structured sections */
  institution_details: institutionDetailsSchema,

  visual_detection: visualDetectionSchema,

  scores: scoresSchema,

  final_decision: finalDecisionSchema,

  /* Quick access shortcut fields */
  ai_total_score: {
    type: Number,
    default: 0,
    index: true
  },

  final_status: {
    type: String,
    enum: ["Approved", "Rejected", "Pending"],
    default: "Pending",
    index: true
  },

  parameter_compliance_score: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: ["pending", "running", "completed", "failed"],
    default: "pending",
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

}, { timestamps: true });


const AIAnalysis = mongoose.model("AIAnalysis", aiAnalysisSchema);
export default AIAnalysis;