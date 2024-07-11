import { NotificationController } from '../controllers';
import AuthMiddleware from '../middlewares/auth';
import express from 'express';
const routeNotification = express.Router();

routeNotification.get(
  '/get-list-notification',
  AuthMiddleware.Authentication,
  NotificationController.GetListNotification,
);

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

routeNotification.put('/read-notification/:id', AuthMiddleware.Authentication, NotificationController.ReadNotification);

routeNotification.delete(
  '/delete-notification/:id',
  AuthMiddleware.Authentication,
  NotificationController.DeleteNotification,
);

export default routeNotification;
