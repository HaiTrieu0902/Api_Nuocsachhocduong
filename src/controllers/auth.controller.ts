import { Request, Response } from 'express';
import { HttpStatusCode, SYSTEM_NOTIFICATION } from '../constant';
import { MESSAGES_ERROR } from '../constant/error';
import Helper from '../helper/Helper';
import { AuthService } from '../service';

const dotenv = require('dotenv');
dotenv.config();

const AuthController = {
  Login: async (req: Request, res: Response): Promise<Response> => {
    try {
      const loginResult = await AuthService.loginUser(req.body);
      res.cookie('access_token', loginResult.token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        path: '/',
        secure: false,
      });
      return res
        .status(HttpStatusCode.Ok)
        .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION.SUCCESS, loginResult));
    } catch (error: any) {
      if (error?.statusCode === HttpStatusCode.NotFound) {
        return res
          .status(HttpStatusCode.NotFound)
          .send(Helper.ResponseError(HttpStatusCode.NotFound, error?.message, error));
      } else {
        return res
          .status(HttpStatusCode.InternalServerError)
          .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
      }
    }
  },

  Logout: async (req: Request, res: Response) => {
    try {
      res.clearCookie('access_token');
      res.status(HttpStatusCode.Ok).json({ message: SYSTEM_NOTIFICATION.LOGOUT });
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },
  /* Forget password , check mail */
  ForgotPasswod: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password, confirmPassword } = req.body;
      const params = {
        email,
        password,
        confirmPassword,
      };
      const result = await AuthService.forgotPassWordUser(params);
      return res
        .status(HttpStatusCode.Ok)
        .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION.RESET_PASS, result));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },

  /** handle sendOTP code  */
  SendOTPToEmailUser: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email } = req.body;
      const result = await AuthService.sendOTPToEmail(email);
      return res
        .status(HttpStatusCode.Ok)
        .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION.SUCCESS, result));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },

  /** handle verify OTP  */
  VerifyOTPUser: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, otp } = req.body;
      const result = await AuthService.verifyOTP(email, otp);
      if (result) {
        return res
          .status(HttpStatusCode.Ok)
          .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION.SUCCESS, result));
      } else {
        return res
          .status(HttpStatusCode.InternalServerError)
          .send(Helper.ResponseError(HttpStatusCode.InternalServerError, MESSAGES_ERROR.OTP_ERROR, result));
      }
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },
};

export default AuthController;
