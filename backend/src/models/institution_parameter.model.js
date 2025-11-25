import mongoose from "mongoose";
import Institution from "./institution.model.js";

const parameterSchema = new mongoose.Schema({
  institution_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Institution",
    required: true
  },
  parameter_category: { type: String, required: true },
  parameter_name: { type: String, required: true },
  norm_value: { type: String, required: true },
  institution_value: { type: String, default: "" },
  authority: String,
  criticality: String,
  is_compliant: { type: Boolean, default: false }
}, { timestamps: true });

const Parameter = mongoose.model("Parameter", parameterSchema);
export default Parameter;
