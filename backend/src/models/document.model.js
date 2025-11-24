import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  institution_id: { type: mongoose.Schema.Types.ObjectId, ref: "Institution" },
  application_id: { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
   uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  file_url: String,
  category: String,
  uploaded_at: { type: Date, default: Date.now }
});

const Document = mongoose.model("Document", documentSchema);

export default Document;