import { AuthController } from '../controllers';

const express = require('express');
const routeAuth = express.Router();

routeAuth.post('/login', AuthController.Login);
routeAuth.post('/sendOTP', AuthController.SendOTPToEmailUser);
routeAuth.post('/checkOTP', AuthController.VerifyOTPUser);
routeAuth.post('/forgot-password', AuthController.ForgotPasswod);
export default routeAuth;
