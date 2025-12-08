import mongoose from "mongoose";

const parameterTemplateSchema = new mongoose.Schema({
  parameter_category: { type: String, required: true },
  parameter_name: { type: String, required: true, unique: true },
  norm_value: { type: String, required: true },
  authority: { type: String, required: true },
  criticality: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  description: String,
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

// Index for faster queries
parameterTemplateSchema.index({ parameter_category: 1 });
parameterTemplateSchema.index({ is_active: 1 });

const ParameterTemplate = mongoose.model("ParameterTemplate", parameterTemplateSchema);
export default ParameterTemplate;
