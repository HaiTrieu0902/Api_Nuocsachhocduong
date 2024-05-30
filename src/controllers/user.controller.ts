import { Request, Response } from 'express';
import Helper from '../helper/Helper';

import { HttpStatusCode, SYSTEM_NOTIFICATION } from '../constant';
import { UserService } from '../service';
const dotenv = require('dotenv');
dotenv.config();

const UserController = {
  CreateAccount: async (req: Request, res: Response): Promise<Response> => {
    try {
      const newUser = await UserService.createUser(req.body, req);
      return res
        .status(HttpStatusCode.Created)
        .send(Helper.ResponseData(HttpStatusCode.Created, SYSTEM_NOTIFICATION?.USER_CREATE, newUser));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },

  GetDetailUser: async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await UserService.getDetailUser(req, res as never);
      return res
        .status(HttpStatusCode.Ok)
        .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION?.SUCCESS, data));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },

  UpdateUser: async (req: Request, res: Response): Promise<Response> => {
    try {
      const updateUser = await UserService.updateUser(req.body, req);
      return res
        .status(HttpStatusCode.Ok)
        .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION?.SUCCESS, updateUser));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },

  /* Change Password */
  ChangePassword: async (req: Request, res: Response): Promise<Response> => {
    try {
      const params = {
        ...req.body,
      };
      const result = await UserService.changePassword(params);
      return res
        .status(HttpStatusCode.Ok)
        .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION.SUCCESS, result));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },
};

export default UserController;
