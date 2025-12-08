import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    institution_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institution',
        required: true,
        index: true,
    },
    application_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
        default: null,
        index: true,
    },
    title: { type: String, required: true },
    file_url: { type: String, required: true },
    public_id: { type: String }, // cloudinary public id for deletions
    // category: { type: String, default: 'general' }, // e.g., accreditation, enrollment, audited_statements
    uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    uploaded_at: { type: Date, default: Date.now },
});

const Document = mongoose.model('Document', documentSchema);

export default Document;
