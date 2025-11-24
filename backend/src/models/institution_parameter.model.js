import mongoose from "mongoose";

const parameterSchema = new mongoose.Schema({
  institution_id: { type: mongoose.Schema.Types.ObjectId, ref: "Institution" },
  parameter_category: String,
  parameter_name: String,
  norm_value: String,
  institution_value: String,
  authority: String,
  criticality: String,
  is_compliant: Boolean
});

const Parameter = mongoose.model("Parameter", parameterSchema);

export default Parameter;
    