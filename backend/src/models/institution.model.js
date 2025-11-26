import mongoose from 'mongoose';

const institutionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  name: { type: String, required: true, unique: true },
  type: { type: String, enum: ['aicte', 'ugc'], required: true },
  state: String,
  district: String,
  address: String,
  established_year: Number,

  total_students: Number,
  total_faculty: Number,
  website: String,
  accreditation_status: String,

  parameters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Parameter' }]
}, { timestamps: true });

const Institution = mongoose.model('Institution', institutionSchema);
export default Institution;
