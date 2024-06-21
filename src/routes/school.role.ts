import { NewsController, SchoolController } from '../controllers';
import AuthMiddleware from '../middlewares/auth';

const express = require('express');
const routeSchool = express.Router();

routeSchool.get('/get-list-school', AuthMiddleware.Authentication, SchoolController.GetListSchool);

routeSchool.get('/get-detail-school/:id', AuthMiddleware.Authentication, SchoolController.GetDetailSchool);
routeSchool.post(
  '/create-school',
  AuthMiddleware.Authentication,
  AuthMiddleware.RoleAdmin,
  SchoolController.CreateSchool,
);
routeSchool.put(
  '/update-school',
  AuthMiddleware.Authentication,
  AuthMiddleware.RoleAdmin,
  SchoolController.UpdateSchool,
);
routeSchool.delete(
  '/delete-school/:id',
  AuthMiddleware.Authentication,
  AuthMiddleware.RoleAdmin,
  SchoolController.DeleteSchool,
);

export default routeSchool;
