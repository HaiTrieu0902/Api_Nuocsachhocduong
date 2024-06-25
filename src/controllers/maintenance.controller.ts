import { Request, Response } from 'express';
import Maintenance from '../models/maintenance.model';
import CategoryMaintenance from '../models/categoryMaintenance.model';
import User from '../models/user.model';
import InstallRecord from '../models/installRecord.model';
import Status from '../models/status.model';
import School from '../models/school.model';
import { getPaginatedListMutiplieModel } from '../utils';
import MaintenanceService from '../service/maintenance.service';
import { HttpStatusCode, SYSTEM_NOTIFICATION } from '../constant';
import Helper from '../helper/Helper';
import Product from '../models/product.model';

const MaintenanceController = {
  GetListMaintenance: async (req: Request, res: Response): Promise<Response> => {
    const Parameters = {
      model: Maintenance,
      searchFields: ['title', 'reason'],
      conditions: {
        categoryMaintenanceId: req.query.categoryMaintenanceId,
        accountId: req.query.accountId,
        installRecordId: req.query.installRecordId,
        staffId: req.query.staffId,
        schoolId: req.query.schoolId,
        statusId: req.query.statusId,
      },
      attributes: {
        exclude: ['categoryMaintenanceId', 'accountId', 'installRecordId', 'staffId', 'schoolId', 'statusId'],
      },
      include: [
        {
          model: CategoryMaintenance,
          as: 'categoryMaintenance',
          attributes: ['id', 'name'],
        },
        {
          model: InstallRecord,
          as: 'installRecord',
          attributes: ['id', 'timeInstall', 'warrantyPeriod'],
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'code', 'price', 'images', 'discount'],
            },
          ],
        },
        {
          model: School,
          as: 'school',
          attributes: ['id', 'name', 'address', 'email', 'phoneNumber'],
        },
        {
          model: User,
          as: 'account',
          attributes: ['id', 'fullName', 'avatar'],
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

  CreateMaintenance: async (req: Request, res: Response): Promise<Response> => {
    try {
      const newNews = await MaintenanceService.createMaintenance(req.body);
      return res
        .status(HttpStatusCode.Created)
        .send(Helper.ResponseData(HttpStatusCode.Created, SYSTEM_NOTIFICATION?.SUCCESS, newNews));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },

  GetDetailMaintenance: async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await MaintenanceService.getDetailMaintenance(req);
      return res
        .status(HttpStatusCode.Ok)
        .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION?.SUCCESS, data));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },

  UpdateMaintenance: async (req: Request, res: Response): Promise<Response> => {
    try {
      const updateNews = await MaintenanceService.updateMaintenance(req.body);
      return res
        .status(HttpStatusCode.Ok)
        .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION?.SUCCESS, updateNews));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },

  UpdateStatusMaintenance: async (req: Request, res: Response): Promise<Response> => {
    try {
      const updateNews = await MaintenanceService.updateStatusMaintenance(req.body);
      return res
        .status(HttpStatusCode.Ok)
        .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION?.SUCCESS, updateNews));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },

  DeleteMaintenance: async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await MaintenanceService.deleteMaintenance(req);
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

export default MaintenanceController;
