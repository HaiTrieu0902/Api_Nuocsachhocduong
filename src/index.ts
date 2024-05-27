import express, { Request, Response } from 'express';
import routerInit from './routes';
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();

/** Ensure the uploads directory exists */
// const uploadDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

/** Upload Common file images */
// const storage = multer.diskStorage({
//   destination: function (req: Request, file: any, cb: any) {
//     cb(null, uploadDir);
//   },
//   filename: function (req: Request, file: any, cb: any) {
//     const timestamp = Date.now();
//     const fileExtension = path.extname(file.originalname);
//     const baseName = path.basename(file.originalname, fileExtension);
//     const newFileName = `${baseName}-${timestamp}${fileExtension}`;
//     cb(null, newFileName);
//   },
// });

// const upload = multer({ storage: storage });

// app.post('/api/common/upload-images', upload.array('images', 12), function (req: any, res, next) {
//   res.send({
//     status: 200,
//     data: req.files,
//   });
// });

/* Parser */
dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  return res.status(200).send({ message: 'Server is running' });
});

/* Router Init */
// app.use(routerInit);
routerInit(app);

/* Serve static files from the uploads directory */
const uploadsPath = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

app.listen(process.env.APP_PORT, () => {
  console.log(`Example app listening on port ${process.env.APP_PORT}`);
});
