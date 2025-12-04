import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    institution_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institution',
    },
    submitted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
        type: String,
        enum: ['submitted', 'under_review', 'approved', 'rejected'],
    },
    approved_by: {
        type: String,
        enum: ['ugc', 'aicte'],
        required: true,
    },
<<<<<<< HEAD
    approved_by_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    remarks: { type: String },
    isApproved: { type: Boolean, default: false },
=======
>>>>>>> 70f44ec888b96bac5a76ba94e51bd4ea80c51050
    ai_analysis: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AIAnalysis' }],
    ai_report: { type: mongoose.Schema.Types.Mixed, ref: 'AIReport' },
    submitted_at: { type: Date, default: Date.now },
});

const Application = mongoose.model('Application', applicationSchema);

export default Application;
