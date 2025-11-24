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
    submitted_at: { type: Date, default: Date.now },
});

const Application = mongoose.model('Application', applicationSchema);

export default Application;
