import express from 'express';
import { CommonController } from '../controllers';
import upload from '../utils/upload';

const routeCommon = express.Router();

routeCommon.post('/upload-images', upload.array('images', 12), CommonController.uploadImages);
routeCommon.get('/images/:fileName', CommonController.getImage);

export default routeCommon;
