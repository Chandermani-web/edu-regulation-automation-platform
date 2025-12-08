import mongoose from 'mongoose';

const querySchema = new mongoose.Schema(
    {
        application_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application',
            required: true,
        },
        raised_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }, // reviewer or institution user
        to_role: {
            type: String,
            enum: ['institution', 'ugc', 'aicte', 'super_admin'],
        }, // who should answer
        message: { type: String, required: true },
        reply: {
            text: String,
            replied_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            replied_at: Date,
        },
        is_resolved: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Query = mongoose.model('Query', querySchema);

export default Query;
