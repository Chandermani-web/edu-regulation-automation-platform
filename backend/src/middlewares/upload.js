import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();

// memory storage -> we send buffer to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // allow pdf, doc, docx, images
  const allowed = /pdf|vnd.openxmlformats-officedocument.wordprocessingml.document|msword|jpeg|jpg|png/;
  if (allowed.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Allowed: pdf, doc, docx, jpg, png'), false);
  }
};

export const uploadSingle = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter,
});