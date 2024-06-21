import { Request, Response } from 'express';
import School from '../models/school.model';
import User from '../models/user.model';
import { getListWithPaginationAssociations } from '../utils';
import { SchoolService } from '../service';
import { HttpStatusCode, SYSTEM_NOTIFICATION } from '../constant';
import Helper from '../helper/Helper';

const SchoolController = {
  GetListSchool: async (req: Request, res: Response): Promise<Response> => {
    const Parameters = {
      model: School,
      subModel: User,
      attributes: ['id', 'fullName', 'email'],
      as: 'user',
      exclude: ['accountId'],
      searchFields: ['title', 'content'],
    };
    return getListWithPaginationAssociations(req, res, Parameters);
  },

  CreateSchool: async (req: Request, res: Response): Promise<Response> => {
    try {
      const newSchool = await SchoolService.createSchool(req.body, req);
      return res
        .status(HttpStatusCode.Created)
        .send(Helper.ResponseData(HttpStatusCode.Created, SYSTEM_NOTIFICATION?.SUCCESS, newSchool));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },

  GetDetailSchool: async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await SchoolService.getDetailSchool(req, res as never);
      return res
        .status(HttpStatusCode.Ok)
        .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION?.SUCCESS, data));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },

  UpdateSchool: async (req: Request, res: Response): Promise<Response> => {
    try {
      const updateSchool = await SchoolService.updateSchool(req.body, req);
      return res
        .status(HttpStatusCode.Ok)
        .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION?.SUCCESS, updateSchool));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },

  DeleteSchool: async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await SchoolService.deleteSchool(req, res as never);
      return res
        .status(HttpStatusCode.Ok)
        .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION.SUCCESS, null));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },
};

export default SchoolController;
