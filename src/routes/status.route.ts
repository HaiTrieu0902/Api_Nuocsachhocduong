import { StatusController } from '../controllers';
import AuthMiddleware from '../middlewares/auth';
const express = require('express');
const routeStatus = express.Router();

routeStatus.get('/get-list-status', AuthMiddleware.Authentication, StatusController.GetList);
routeStatus.post(
  '/create-status',
  AuthMiddleware.Authentication,
  AuthMiddleware.SuperAdmin,
  StatusController.CreateStatus,
);
routeStatus.put(
  '/update-status',
  AuthMiddleware.Authentication,
  AuthMiddleware.SuperAdmin,
  StatusController.UpdateStatus,
);
routeStatus.delete(
  '/delete-status/:id',
  AuthMiddleware.Authentication,
  AuthMiddleware.SuperAdmin,
  StatusController.DeleteStatus,
);
routeStatus.delete(
  '/delete-status',
  AuthMiddleware.Authentication,
  AuthMiddleware.SuperAdmin,
  StatusController.DeleteMultipleStatus,
);

export default routeStatus;
