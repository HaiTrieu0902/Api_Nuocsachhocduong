import { Request, Response } from 'express';
import Helper from '../helper/Helper';
import UserService from '../service/user.service';
import { SYSTEM_NOTIFICATION } from '../constant';
const dotenv = require('dotenv');
dotenv.config();

const UserController = {
  CreateAccount: async (req: Request, res: Response): Promise<Response> => {
    try {
      const newUser = await UserService.createUser(req.body, req);
      return res.status(201).send(Helper.ResponseData(201, SYSTEM_NOTIFICATION?.USER_CREATE, newUser));
    } catch (error) {
      return res.status(500).send(Helper.ResponseError(500, '', error));
    }
  },

  GetDetailUser: async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await UserService.getDetailUser(req, res as never);
      return res.status(201).send(Helper.ResponseData(200, SYSTEM_NOTIFICATION?.SUCCESS, data));
    } catch (error) {
      return res.status(500).send(Helper.ResponseError(500, '', error));
    }
  },

  UpdateUser: async (req: Request, res: Response): Promise<Response> => {
    try {
      const updateUser = await UserService.updateUser(req.body, req);
      return res.status(201).send(Helper.ResponseData(200, SYSTEM_NOTIFICATION?.SUCCESS, updateUser));
    } catch (error) {
      return res.status(500).send(Helper.ResponseError(500, '', error));
    }
  },

  /* Change Password */
  ChangePassword: async (req: Request, res: Response): Promise<Response> => {
    try {
      const params = {
        ...req.body,
      };
      console.log('test', params);
      const result = await UserService.changePassword(params);
      return res.status(200).send(Helper.ResponseData(200, SYSTEM_NOTIFICATION.SUCCESS, result));
    } catch (error) {
      return res.status(500).send(Helper.ResponseError(500, '', error));
    }
  },
};

export default UserController;
