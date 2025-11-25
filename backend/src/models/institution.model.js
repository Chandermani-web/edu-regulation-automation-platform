import mongoose from 'mongoose';

const institutionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  name: { type: String, required: true, unique: true },
  type: { type: String, enum: ['university', 'college'], required: true },
  state: String,
  district: { type: String, unique: true },
  address: { type: String, unique: true },
  established_year: Number,

  total_students: Number,
  total_faculty: Number,
  website: { type: String, unique: true },
  accreditation_status: String,

  parameters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Parameter' }]
}, { timestamps: true });

const Institution = mongoose.model('Institution', institutionSchema);
export default Institution;
