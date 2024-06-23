import { UserController } from '../controllers';
import AuthMiddleware from '../middlewares/auth';
import validations from '../middlewares/validation/validation';

const express = require('express');
const routeUser = express.Router();

routeUser.get('/get-list-user', AuthMiddleware.Authentication, UserController.GetListUser);

routeUser.get('/get-user-school/:schoolId', AuthMiddleware.Authentication, UserController.GetDetailUserBySchool);

routeUser.get('/get-profile/:id', AuthMiddleware.Authentication, UserController.GetDetailUser);
routeUser.post(
  '/create-user',
  validations?.RegisterValidation,
  AuthMiddleware.Authentication,
  AuthMiddleware.RoleAdmin,
  UserController.CreateAccount,
);
routeUser.put('/update-user', AuthMiddleware.Authentication, UserController.UpdateUser);
routeUser.put('/change-password', AuthMiddleware.Authentication, UserController.ChangePassword);
routeUser.delete('/delete-user/:id', AuthMiddleware.Authentication, UserController.DeleteUser);

export default routeUser;
