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
routeCommon.get('/images/:fileName', CommonController.getImage);

routeCommon.get('/get-devices', CommonController.GetListDevices);
routeCommon.post('/create-device', CommonController.CreatDevices);
routeCommon.delete('/remove-device/:id', AuthMiddleware.Authentication, CommonController.RemoveDevices);
export default routeCommon;
