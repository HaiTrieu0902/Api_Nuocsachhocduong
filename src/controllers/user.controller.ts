import { Request, Response } from 'express';
import Helper from '../helper/Helper';
import UserService from '../service/user.service';
const dotenv = require('dotenv');
dotenv.config();

const UserController = {
  CreateAccount: async (req: Request, res: Response): Promise<Response> => {
    try {
      const newUser = await UserService.createUser(req.body, req);
      return res.status(201).send(Helper.ResponseData(201, 'Tạo tài khoảnh thành công', newUser));
    } catch (error) {
      return res.status(500).send(Helper.ResponseError(500, '', error));
    }
  },

  GetDetailUser: async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await UserService.getDetailUser(req, res as never);
      return res.status(201).send(Helper.ResponseData(200, 'Thành công', data));
    } catch (error) {
      return res.status(500).send(Helper.ResponseError(500, '', error));
    }
  },
};

export default UserController;
