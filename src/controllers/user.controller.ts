import { Request, Response } from 'express';
import Helper from '../helper/Helper';

import { HttpStatusCode, SYSTEM_NOTIFICATION } from '../constant';
import { UserService } from '../service';
import User from '../models/user.model';
import { MESSAGES_ERROR } from '../constant/error';
import Role from '../models/role.model';
import { getListWithPaginationAssociations } from '../utils';
const dotenv = require('dotenv');
dotenv.config();

const UserController = {
  GetListUser: async (req: Request, res: Response): Promise<Response> => {
    const Parameters = {
      model: User,
      subModel: Role,
      attributes: ['role'],
      as: 'role',
      exclude: ['roleId'],
      conditions: { roleId: req.query.roleId },
      searchFields: ['email', 'fullName'],
    };
    return getListWithPaginationAssociations(req, res, Parameters);
  },

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

  DeleteUser: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      // user?.destroy();
      if (!user) {
        return res.status(HttpStatusCode.NotFound).send({
          status: HttpStatusCode.NotFound,
          message: MESSAGES_ERROR.USER_NOT_EXIST,
        });
      }
      user.isDelete = true;
      await user?.save();
      return res
        .status(HttpStatusCode.Ok)
        .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION.SUCCESS, null));
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
