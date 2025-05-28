import fs from 'fs';
import multer from 'multer';
import path from 'path';

const uploadPath = 'middlewares/uploads/';

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, uploadPath);
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

export default upload;
