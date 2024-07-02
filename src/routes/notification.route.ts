import { NotificationController } from '../controllers';
import AuthMiddleware from '../middlewares/auth';
const express = require('express');
const routeNotification = express.Router();

routeNotification.post(
  '/create-notification-device',
  AuthMiddleware.Authentication,
  NotificationController.CreateSingleNotiDevice,
);

export default routeNotification;
