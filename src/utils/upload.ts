import multer from 'multer';
import path from 'path';
import fs from 'fs';

/** Ensure the uploads directory exists */
const uploadDir = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Ensure parent directories are created
}

/** Upload Common file images */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const fileExtension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, fileExtension);
    const newFileName = `${baseName}-${timestamp}${fileExtension}`;
    cb(null, newFileName);
  },
});

const upload = multer({ storage: storage });

export default upload;
