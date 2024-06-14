import { RoleController } from '../controllers';
import AuthMiddleware from '../middlewares/auth';
const express = require('express');
const routeRole = express.Router();

routeRole.get('/get-list-role', AuthMiddleware.Authentication, AuthMiddleware.RoleAdmin, RoleController.GetList);
routeRole.post('/create-role', AuthMiddleware.Authentication, AuthMiddleware.SuperAdmin, RoleController.CreateRole);
routeRole.put('/update-role', AuthMiddleware.Authentication, AuthMiddleware.SuperAdmin, RoleController.UpdateRole);
routeRole.delete(
  '/delete-role/:id',
  AuthMiddleware.Authentication,
  AuthMiddleware.SuperAdmin,
  RoleController.DeleteRole,
);
routeRole.delete(
  '/delete-roles',
  AuthMiddleware.Authentication,
  AuthMiddleware.SuperAdmin,
  RoleController.DeleteMultipleRoles,
);

export default routeRole;
