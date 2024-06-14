import express from 'express';
import { CommonController } from '../controllers';
import upload from '../utils/upload';
import AuthMiddleware from '../middlewares/auth';

const routeCommon = express.Router();

routeCommon.post(
  '/upload-images',
  AuthMiddleware.Authentication,
  upload.array('images', 12),
  CommonController.uploadImages,
);
routeCommon.get('/images/:fileName', AuthMiddleware.Authentication, CommonController.getImage);

export default routeCommon;
