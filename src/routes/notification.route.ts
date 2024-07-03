import { NotificationController } from '../controllers';
import AuthMiddleware from '../middlewares/auth';
const express = require('express');
const routeNotification = express.Router();

routeNotification.post(
  '/create-notification-device',
  AuthMiddleware.Authentication,
  NotificationController.CreateSingleNotiDevice,
);

routeNotification.post(
  '/create-notification',
  AuthMiddleware.Authentication,
  NotificationController.CreateNotification,
);

routeNotification.delete(
  '/delete-notification/:id',
  AuthMiddleware.Authentication,
  NotificationController.DeleteNotification,
);

export default routeNotification;
