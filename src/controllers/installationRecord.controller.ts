import { Request, Response } from 'express';
import { HttpStatusCode, SYSTEM_NOTIFICATION } from '../constant';
import Helper from '../helper/Helper';
import InstallRecord from '../models/installRecord.model';
import Product from '../models/product.model';
import School from '../models/school.model';
import Status from '../models/status.model';
import User from '../models/user.model';
import { InstallRecordService } from '../service';
import { getPaginatedListMutiplieModel } from '../utils';

const InstallRecordController = {
  GetListInstallRecord: async (req: Request, res: Response): Promise<Response> => {
    const Parameters = {
      model: InstallRecord,
      searchFields: ['totalAmount', 'quantity'],
      conditions: { accountId: req.query.accountId },
      attributes: { exclude: ['productId', 'schoolId', 'statusId', 'staffId', 'accountId'] },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'code', 'price'],
        },
        {
          model: School,
          as: 'school',
          attributes: ['id', 'name', 'address', 'email', 'phoneNumber'],
        },
        {
          model: User,
          as: 'account',
          attributes: ['id', 'fullName'],
        },
        {
          model: User,
          as: 'staff',
          attributes: ['id', 'fullName'],
        },
        {
          model: Status,
          as: 'status',
          attributes: ['id', 'name'],
        },
      ],
    };
    return getPaginatedListMutiplieModel(Parameters, req, res);
  },

  CreateInstallRecord: async (req: Request, res: Response): Promise<Response> => {
    try {
      const newNews = await InstallRecordService.createInstallRecord(req.body, req);
      return res
        .status(HttpStatusCode.Created)
        .send(Helper.ResponseData(HttpStatusCode.Created, SYSTEM_NOTIFICATION?.SUCCESS, newNews));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },

  GetDetailInstallRecord: async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await InstallRecordService.getDetailInstallRecord(req, res as never);
      return res
        .status(HttpStatusCode.Ok)
        .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION?.SUCCESS, data));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },

  UpdateInstallRecord: async (req: Request, res: Response): Promise<Response> => {
    try {
      const updateNews = await InstallRecordService.updateInstallRecord(req.body, req);
      return res
        .status(HttpStatusCode.Ok)
        .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION?.SUCCESS, updateNews));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },

  UpdateStatusInstallRecord: async (req: Request, res: Response): Promise<Response> => {
    try {
      const updateNews = await InstallRecordService.updateStatusInstallRecord(req.body, req);
      return res
        .status(HttpStatusCode.Ok)
        .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION?.SUCCESS, updateNews));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },

  DeleteInstallRecord: async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await InstallRecordService.deleteInstallRecord(req, res as never);
      return res
        .status(HttpStatusCode.Ok)
        .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION.SUCCESS, data));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },
};

export default InstallRecordController;
