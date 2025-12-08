import express from 'express';
import { uploadSingle } from '../middlewares/upload.js';
import { auth } from '../middlewares/auth.middlware.js';
import { deleteDocument, uploadDocument } from '../controllers/document.controller.js';

const router = express.Router();

router.post("/upload", auth, uploadSingle.single('file'), uploadDocument);
// router.put("/update", auth, updateDocument)
router.delete("/delete", auth, deleteDocument);

// router.get("/",auth, getDocumentsByInstitution);
// router.get("/list",auth,listDocuments);

export default router;