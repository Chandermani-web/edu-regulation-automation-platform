import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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
        enum: ['aicte', 'ugc'],
    },
    remarks: { type: String },
    isApproved: { type: Boolean, default: false },
    ai_analysis: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AIAnalysis' }],
    ai_report: { type: mongoose.Schema.Types.ObjectId, ref: 'AIReport' },
    submitted_at: { type: Date, default: Date.now },
});

const Application = mongoose.model('Application', applicationSchema);

export default Application;
