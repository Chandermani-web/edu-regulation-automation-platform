import mongoose from 'mongoose';

const institutionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // basic details
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  type: { type: String, enum: ['aicte', 'ugc'], required: true },
  established_year: Number,
  institution_code: String,

  // location details
  state: String,
  district: String,
  pincode: String,
  full_address: String,

  // faculty and student details
  total_faculty: Number,
  total_students: Number,

  // accredentation and website
  NAAC_grade: { type: String },
  NIRF_rank: { type: String },
  AISHE_code: String,
  UDISE_code: String,
  
  website: String,

  courses: [
    {
      type: String
    }
  ],

  parameters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Parameter' }],
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
}, { timestamps: true });

const Institution = mongoose.model('Institution', institutionSchema);
export default Institution;