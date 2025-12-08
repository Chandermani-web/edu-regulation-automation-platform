import mongoose from "mongoose";
import Institution from "./institution.model.js";

const parameterSchema = new mongoose.Schema({
  institution_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Institution",
    required: true
  },
  parameter_template_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ParameterTemplate",
    required: true
  },
  institution_value: { type: String, default: "" },
  is_compliant: { type: Boolean, default: false },
  remarks: String
}, { timestamps: true });

// Compound index to ensure one entry per institution per template
parameterSchema.index({ institution_id: 1, parameter_template_id: 1 }, { unique: true });

const Parameter = mongoose.model("Parameter", parameterSchema);
export default Parameter;