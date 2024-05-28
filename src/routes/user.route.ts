import { UserController } from '../controllers';

const express = require('express');
const routeUser = express.Router();

routeUser.get('/get-profile/:id', UserController.GetDetailUser);
routeUser.post('/create-user', UserController.CreateAccount);
routeUser.put('/update-user', UserController.UpdateUser);
routeUser.put('/changepassword-user', UserController.ChangePassword);

export default routeUser;
