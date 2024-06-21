import { Request, Response } from 'express';
import { HttpStatusCode, SYSTEM_NOTIFICATION } from '../constant';
import Helper from '../helper/Helper';
import InstallRecord from '../models/installRecord.model';
import { InstallRecordService } from '../service';
import Product from '../models/product.model';
import School from '../models/school.model';
import User from '../models/user.model';
import Status from '../models/status.model';
import { Op, Order, where } from 'sequelize';

const InstallRecordController = {
  GetListInstallRecord: async (req: Request, res: Response): Promise<Response> => {
    const searchFields = ['totalAmount', 'quantity'];
    const conditions = { productId: req.query.productId };
    const { page, pageSize, sortBy, sortOrder, search, isDelete, ...query } = req.query;
    const pages = page ? Number(page) : 1;
    const pageSizes = pageSize ? Number(pageSize) : 10;
    const offset = (pages - 1) * pageSizes;

    // Add the conditions to the query if they exist
    const where = conditions
      ? Object.keys(conditions).reduce((acc: any, key) => {
          if (query[key]) {
            acc[key] = query[key];
          }
          return acc;
        }, {})
      : {};

    if (search && searchFields) {
      where[Op.or] = searchFields.map((field) => ({
        [field]: { [Op.like]: `%${search}%` },
      }));
    }

    // Add isDelete condition
    if (isDelete !== undefined) {
      where.isDelete = isDelete === 'true';
    }

    const order: Order =
      sortBy && typeof sortBy === 'string'
        ? [[sortBy, typeof sortOrder === 'string' ? sortOrder : 'ASC']]
        : [['createdAt', 'DESC']];

    const result = await InstallRecord.findAndCountAll({
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
      offset,
      where,
      limit: page ? Number(pageSize) : undefined,
      attributes: { exclude: ['productId', 'schoolId', 'statusId', 'staffId', 'accountId'] },
      order,
    });
    return res.status(HttpStatusCode.Ok).send({
      data: result?.rows,
      total: result.count,
      // pageSize: pageSize,
    });
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
