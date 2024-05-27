import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Helper from '../helper/Helper';
import UserService from '../service/user.service';

const dotenv = require('dotenv');
dotenv.config();

const AuthController = {
  Register: async (req: Request, res: Response): Promise<Response> => {
    try {
      const newUser = await UserService.createUser(req.body, req);
      return res.status(201).send(Helper.ResponseData(201, 'Tạo tài khoảnh thành công', newUser));
    } catch (error) {
      return res.status(500).send(Helper.ResponseError(500, '', error));
    }
  },

  //   Login: async (req: Request, res: Response): Promise<Response> => {
  //     try {
  //       const { email, password } = req.body;
  //       const loginResult = await AuthService.loginUser(email, password);
  //       res.cookie('access_token', loginResult.token, {
  //         httpOnly: true,
  //         maxAge: 24 * 60 * 60 * 1000,
  //         path: '/',
  //         secure: false,
  //       });
  //       return res.status(200).send(Helper.ResponseData(200, 'Login Successfully', loginResult));
  //     } catch (error: any) {
  //       console.log('error', error);
  //       if (error?.statusCode === 404) {
  //         return res.status(404).send(Helper.ResponseError(404, error?.message, error));
  //       } else {
  //         return res.status(500).send(Helper.ResponseError(500, '', error));
  //       }
  //     }
  //   },

  //   Logout: async (req: Request, res: Response) => {
  //     try {
  //       res.clearCookie('access_token');
  //       res.status(200).json({ message: 'Logged out' });
  //     } catch (error) {
  //       return res.status(500).send(Helper.ResponseError(500, '', error));
  //     }
  //   },

  /* Forget password , check mail */
  //   ForgotPasswod: async (req: Request, res: Response): Promise<Response> => {
  //     try {
  //       const { email, password, confirmPassword } = req.body;
  //       const params = {
  //         email,
  //         password,
  //         confirmPassword,
  //       };
  //       const result = await AuthService.forgotPassWordUser(params);
  //       return res.status(200).send(Helper.ResponseData(200, 'Reset password successfully', result));
  //     } catch (error) {
  //       return res.status(500).send(Helper.ResponseError(500, '', error));
  //     }
  //   },

  /* Change Password */
  //   ChangePassword: async (req: Request, res: Response): Promise<Response> => {
  //     try {
  //       const { email, currentPassword, newPassword, confirmPassword } = req.body;
  //       const params = {
  //         email,
  //         currentPassword,
  //         newPassword,
  //         confirmPassword,
  //       };
  //       const result = await AuthService.changePasswordUser(params);
  //       return res.status(200).send(Helper.ResponseData(200, 'Reset password successfully', result));
  //     } catch (error) {
  //       return res.status(500).send(Helper.ResponseError(500, '', error));
  //     }
  //   },

  /* Verify email */
  //   Verify: async (req: Request, res: Response): Promise<Response> => {
  //     try {
  //       const { token } = req.params;
  //       const user = await AuthService.verifyEmailUser(token);
  //       if (user.isVerify !== true) {
  //         user.isVerify = true;
  //         await user.save();
  //         return res.status(200).send(Helper.ResponseData(200, 'Email Verified Successfully', ''));
  //       } else {
  //         return res.status(400).send(Helper.ResponseError(400, 'Email Already Verified', ''));
  //       }
  //     } catch (error) {
  //       return res.status(500).send(Helper.ResponseError(500, '', error));
  //     }
  //   },
};

export default AuthController;
