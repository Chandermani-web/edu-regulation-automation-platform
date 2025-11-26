import cloudinary from '../services/cloudinary.js';
import { asyncHandler } from '../services/asyncHandler.js';
import Document from '../models/document.model.js';
import Application from '../models/application.model.js';

// create the document
export const uploadDocument = asyncHandler(async (req, res) => {
    const { institutionId, applicationId, title, category } = req.body;
    const file = req.file;

    if (!institutionId)
        return res
            .status(400)
            .json({ ok: false, message: 'institutionId is required' });

    if (!file)
        return res.status(400).json({ ok: false, message: 'No file uploaded' });

    const uploadResult = await cloudinary.uploader.upload_stream(
        { folder: `sih/institution/${institutionId}`, resource_type: 'auto' },
        (err, result) => {
            if (err) throw err;
            return result;
        }
    );

    const doc = await Document.create({
        institution_id: institutionId,
        application_id: applicationId || null,
        title: title || file.originalname || 'document',
        file_url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        category: category || 'general',
        uploaded_by: req.user ? req.user._id : null,
        uploaded_at: new Date(),
    });

    // Optionally, if document is attached to application, update application timestamp
    if (applicationId) {
        await Application.findByIdAndUpdate(applicationId, {
            $set: { updatedAt: new Date() },
        });
    }

    res.status(201).json({ success: true, data: doc });
});

// update the document
export const updateDocument = asyncHandler(async (req, res) => {
    const { id } = req.body;
    const updates = (({ title, category, applicationId }) => ({ title, category, application_id: applicationId }))(req.body);

    const doc = await Document.findByIdAndUpdate(id, updates, { new: true });

    if (!doc)
        return res
            .status(404)
            .json({ success: false, message: 'Document not found' });

    res.json({ success: true, data: doc });
});

// delete the document
export const deleteDocument = asyncHandler(async (req, res) => {
    const { id } = req.body;
    const doc = await Document.findById(id);

    if (!doc)
        return res
            .status(404)
            .json({ success: false, message: 'Document not found' });

    if (doc.public_id) {
        try {
            await cloudinary.uploader.destroy(doc.public_id, {
                resource_type: 'auto',
            });
        } catch (err) {
            return res
                .status(404)
                .json({ message: `Cloudinary deletion failed ${err}` });
        }
    }

    await doc.remove();
    res.json({ success: true, message: 'Document Deleted' });
});

// get the document
export const getDocumentsByInstitution = asyncHandler(async (req, res) => {
    // const { institutionId } = req.body; // or req.query if GET request
    const { institutionId } = req.query;

    if (!institutionId)
        return res
            .status(400)
            .json({ success: false, message: 'institutionId is required' });

    const documents = await Document.find({ institution_id: institutionId })
        .populate('uploaded_by', 'name email role')
        .populate('application', 'status submitted_at'); // optional

    res.status(200).json({
        success: true,
        count: documents.length,
        documents,
    });
});

// list of all document
export const listDocuments = asyncHandler(async (req, res) => {
  const list = await Document.find()
    .populate("institution_id", "name type")
    .populate("application_id", "status submitted_at")
    .populate("uploaded_by", "name email role")
    .sort({ uploaded_at: -1 });

  res.json({ success: true, count: list.length, documents: list });
});