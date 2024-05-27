import { UserController } from '../controllers';

const express = require('express');
const routeUser = express.Router();

routeUser.get('/get-profile/:id', UserController.GetDetailUser);
routeUser.post('/create-user', UserController.CreateAccount);

export default routeUser;
