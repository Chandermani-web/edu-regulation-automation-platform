import mongoose from "mongoose";

const institutionSchema = new mongoose.Schema({
  name: String,
  type: String,
  state: String,
  district: String,
  address: String,
  established_year: Number,

  parameter: [{ type: mongoose.Schema.Types.ObjectId, ref: "Parameter" }],
  total_students: Number,
  total_faculty: Number,
  website: String,
  accreditation_status: String
});

const Institution = mongoose.model("Institution", institutionSchema);

export default Institution;