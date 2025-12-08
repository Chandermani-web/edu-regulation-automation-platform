import cloudinary from '../services/cloudinary.js';
import { asyncHandler } from '../services/asyncHandler.js';
import Document from '../models/document.model.js';
import Application from '../models/application.model.js';
import Institution from '../models/institution.model.js';

// create the document
export const uploadDocument = asyncHandler(async (req, res) => {
    const { applicationId, title, institution_id } = req.body;
    const file = req.file;

    console.log(institution_id, file?.originalname, title);
    console.log(req.body);

    // Validate institution_id
    if (!institution_id || institution_id === 'null' || institution_id === 'undefined')
        return res
            .status(400)
            .json({ ok: false, message: 'Valid institution_id is required' });

    if (!file)
        return res.status(400).json({ ok: false, message: 'No file uploaded' });

    const docu = await Document.findOne({ institution_id });

    if (docu) {
        await Document.deleteMany({ institution_id });
        await Institution.findByIdAndUpdate(institution_id, { $set: { documents: [] } });
    }

    // ✅ Proper Cloudinary stream upload
    const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: `sih/institution/${institution_id}`,
                resource_type: 'raw',
                access_mode: 'public',
                overwrite: true,
                format: 'pdf',
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary Error:', error);
                    reject(error);
                } else {
                    console.log('Cloudinary Result:', result);
                    resolve(result);
                }
            }
        );

        stream.end(file.buffer); // ⬅️ very important
    });

    const doc = await Document.create({
        institution_id,
        application_id: applicationId || null,
        title: title || file.originalname || 'document',
        file_url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        uploaded_by: req.user ? req.user._id : null,
        uploaded_at: new Date(),
    });

    await Institution.findByIdAndUpdate(institution_id, {
        $push: { documents: doc._id },
    });

    if (applicationId) {
        await Application.findByIdAndUpdate(applicationId, {
            $set: { updatedAt: new Date() },
        });
    }

    res.status(201).json({
        success: true,
        message: 'Document uploaded successfully',
        data: doc,
    });
});

// // update the document
// export const updateDocument = asyncHandler(async (req, res) => {
//     const { id } = req.body;
//     const updates = (({ title, applicationId }) => ({
//         title,
//         application_id: applicationId,
//     }))(req.body);

//     const doc = await Document.findByIdAndUpdate(id, updates, { new: true });

//     if (!doc)
//         return res
//             .status(404)
//             .json({ success: false, message: 'Document not found' });

//     await Institution.findByIdAndUpdate(doc.institution_id, {
//         $pull: { documents: doc._id },
//     });

//     await Institution.findByIdAndUpdate(doc.institution_id, {
//         $push: { documents: doc._id },
//     });

//     res.json({ success: true, data: doc });
// });

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

    await Institution.findByIdAndUpdate(doc.institution_id, {
        $pull: { documents: doc._id },
    });

    await Institution.findByIdAndUpdate(doc.institution_id, {
        $pull: { documents: doc._id },
    });

    res.json({ success: true, message: 'Document Deleted' });
});

// // get the document
// export const getDocumentsByInstitution = asyncHandler(async (req, res) => {
//     const { institution_id } = req.body; // or req.query if GET request
//     // const { institutionId } = req.query;

//     console.log('Body:', req.body);

//     if (!institution_id)
//         return res
//             .status(400)
//             .json({ success: false, message: 'institutionId is required' });

//     const documents = await Document.find({ institution_id: institution_id })
//         .populate('uploaded_by', 'name email role')
//         .populate('application', 'status submitted_at'); // optional

//     res.status(200).json({
//         success: true,
//         count: documents.length,
//         documents,
//     });
// });

// // list of all document
// export const listDocuments = asyncHandler(async (req, res) => {
//     const list = await Document.find()
//         .populate('institution_id', 'name type')
//         .populate('application_id', 'status submitted_at')
//         .populate('uploaded_by', 'name email role')
//         .sort({ uploaded_at: -1 });

//     res.json({ success: true, count: list.length, documents: list });
// });
