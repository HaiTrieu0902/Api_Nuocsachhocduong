import { Request, Response } from 'express';
import Helper from '../helper/Helper';
import { Parameters, ParametersMutiplie } from '../types/interface';
import { Op, Order, where } from 'sequelize';
import { HttpStatusCode } from '../constant';
import School from '../models/school.model';
import Notification from '../models/notification.model';
import Maintenance from '../models/maintenance.model';
import { ESTATUS } from '../constant/enum';
import { Sequelize } from '../models';
const dotenv = require('dotenv');
dotenv.config();

/** handle get list with Panigation */
export const getListWithPagination = async (
  Parameters: any,

  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { page, pageSize, sortBy, sortOrder, search, ...query } = req.query;
    const pages = page ? Number(page) : 1;
    const pageSizes = pageSize ? Number(pageSize) : 10;
    const offset = (pages - 1) * pageSizes;

    // Add the conditions to the query if they exist
    const where = Parameters?.conditions
      ? Object.keys(Parameters.conditions).reduce((acc: any, key) => {
          if (query[key]) {
            acc[key] = query[key];
          }
          return acc;
        }, {})
      : {};

    // Add search functionality
    if (search && Parameters.searchFields) {
      where[Op.or] = Parameters.searchFields.map((field: any) => ({
        [field]: { [Op.like]: `%${search}%` },
      }));
    }
    // Build sort functionality
    const order = sortBy ? [[sortBy, sortOrder || 'ASC']] : [['createdAt', 'DESC']];
    const result = await Parameters?.model.findAndCountAll({
      offset,
      where,
      limit: page ? Number(pageSize) : undefined,
      order,
    });

    return res.status(HttpStatusCode.Ok).send({
      data: result?.rows,
      total: result?.count,
      pageSize: pageSize,
    });
  } catch (error) {
    return res
      .status(HttpStatusCode.InternalServerError)
      .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
  }
};

/** handle get list with Panigation association */
export const getListWithPaginationAssociations = async (
  req: Request,
  res: Response,
  Parameters: Parameters,
): Promise<Response> => {
  try {
    const { page, pageSize, sortBy, sortOrder, search, isDelete, ...query } = req.query;
    const pages = page ? Number(page) : 1;
    const pageSizes = pageSize ? Number(pageSize) : 10;
    const offset = (pages - 1) * pageSizes;

    // Add the conditions to the query if they exist
    const where = Parameters?.conditions
      ? Object.keys(Parameters.conditions).reduce((acc: any, key) => {
          if (query[key]) {
            acc[key] = query[key];
          }
          return acc;
        }, {})
      : {};

    // Add search functionality
    if (search && Parameters.searchFields) {
      where[Op.or] = Parameters.searchFields.map((field) => ({
        [field]: { [Op.like]: `%${search}%` },
      }));
    }

    // Add isDelete condition
    if (isDelete !== undefined) {
      where.isDelete = isDelete === 'true';
    }

    // Build sort functionality
    const order = sortBy ? [[sortBy, sortOrder || 'ASC']] : [['createdAt', 'DESC']];

    const result = await Parameters?.model.findAndCountAll({
      include: [{ model: Parameters?.subModel, as: Parameters?.as, attributes: Parameters?.attributes }],
      attributes: { exclude: Parameters?.exclude },
      offset,
      where,
      limit: page ? Number(pageSize) : undefined,
      order,
    });
    let transformedResult;

    if (Parameters?.model.name === 'User') {
      const listSchool = await School.findAndCountAll();
      transformedResult = result.rows.map((item: any) => {
        const { password, ...rest } = item.toJSON();
        const schools = item.schoolIds
          .map((schoolId: string) => {
            const school = listSchool.rows.find((s: any) => s.id === schoolId);
            return school ? { id: school.id, name: school.name } : null;
          })
          .filter((school: any) => school !== null);
        return {
          ...rest,
          role: item.role?.role,
          schools: schools,
        };
      });
    }

    return res.status(HttpStatusCode.Ok).send({
      data: transformedResult || result.rows,
      total: result.count,
      pageSize: pageSize,
    });
  } catch (error) {
    return res
      .status(HttpStatusCode.InternalServerError)
      .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
  }
};

export const getPaginatedListMutiplieModel = async (Parameters: ParametersMutiplie, req: Request, res: Response) => {
  try {
    const { page, pageSize, sortBy, sortOrder, search, isDelete, ...query } = req.query;
    const pages = page ? Number(page) : 1;
    const pageSizes = pageSize ? Number(pageSize) : 10;
    const offset = (pages - 1) * pageSizes;

    const where = Parameters?.conditions
      ? Object.keys(Parameters?.conditions).reduce((acc: any, key) => {
          if (query[key]) {
            acc[key] = query[key];
          }
          return acc;
        }, {})
      : {};

    if (search) {
      if (Parameters?.model?.name === 'InstallRecord' || Parameters?.model?.name === 'Maintenance') {
        where[Op.or] = [
          ...Parameters?.searchFields.map((field) => ({
            [field]: { [Op.like]: `%${search}%` },
          })),
          { '$school.name$': { [Op.like]: `%${search}%` } },
          { '$account.fullName$': { [Op.like]: `%${search}%` } },
        ];
      } else {
        where[Op.or] = Parameters?.searchFields.map((field) => ({
          [field]: { [Op.like]: `%${search}%` },
        }));
      }
    }

    if (isDelete !== undefined) {
      where.isDelete = isDelete === 'true';
    }
    const order: Order =
      sortBy && typeof sortBy === 'string'
        ? [[sortBy, typeof sortOrder === 'string' ? sortOrder : 'ASC']]
        : [['createdAt', 'DESC']];

    const result = await Parameters?.model.findAndCountAll({
      include: Parameters?.include,
      offset,
      where: where,
      limit: pageSizes,
      order,
      attributes: Parameters?.attributes,
    });

    if (Parameters?.model?.name === 'Notification') {
      let receiverId = query['receiverId'];
      const resultt = await Notification.findAndCountAll({
        include: Parameters?.include,
        offset,
        where: Sequelize.literal(`JSON_UNQUOTE(JSON_EXTRACT(data, '$.title')) LIKE '%${search}%'`),
        limit: pageSizes,
        order,
        attributes: Parameters?.attributes,
      });

      const listUnread = await Notification.findAndCountAll({
        where: {
          [Op.and]: [{ isRead: false }, { receiverId: receiverId }] as never,
        },
      });
      return res.status(HttpStatusCode.Ok).send({
        data: resultt.rows,
        total: resultt.count,
        totalUnread: listUnread?.count,
        page: page,
        pageSize: pageSizes,
      });
    } else {
      return res.status(HttpStatusCode.Ok).send({
        data: result.rows,
        total: result.count,
        page: page,
        pageSize: pageSizes,
      });
    }
  } catch (error) {
    return res
      .status(HttpStatusCode.InternalServerError)
      .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
  }
};

export const getPaginatedDeviceInstall = async (Parameters: ParametersMutiplie, req: Request, res: Response) => {
  try {
    const { page, pageSize, sortBy, sortOrder, search, isDelete, ...query } = req.query;
    const pages = page ? Number(page) : 1;
    const pageSizes = pageSize ? Number(pageSize) : 10;
    const offset = (pages - 1) * pageSizes;

    const where = Parameters?.conditions
      ? Object.keys(Parameters?.conditions).reduce((acc: any, key) => {
          if (query[key]) {
            acc[key] = query[key];
          }
          return acc;
        }, {})
      : {};

    if (search) {
      if (Parameters?.model?.name === 'InstallRecord') {
        where[Op.or] = [
          ...Parameters?.searchFields.map((field) => ({
            [field]: { [Op.like]: `%${search}%` },
          })),
          { '$school.name$': { [Op.like]: `%${search}%` } },
          { '$product.name$': { [Op.like]: `%${search}%` } },
        ];
      } else {
        where[Op.or] = Parameters?.searchFields.map((field) => ({
          [field]: { [Op.like]: `%${search}%` },
        }));
      }
    }

    if (isDelete !== undefined) {
      where.isDelete = isDelete === 'true';
    }

    const order: Order =
      sortBy && typeof sortBy === 'string'
        ? [[sortBy, typeof sortOrder === 'string' ? sortOrder : 'ASC']]
        : [['createdAt', 'DESC']];

    const result = await Parameters?.model.findAndCountAll({
      include: Parameters?.include,
      offset,
      where: { ...where, statusId: [ESTATUS.COMPLETE, ESTATUS.COMPLETED] },
      limit: pageSizes,
      order,
      attributes: Parameters?.attributes,
    });

    const maintenances = await Maintenance.findAll({
      attributes: {
        exclude: ['images_response', 'images_request'],
      },
      order: order,
    });

    // Create a mapping of maintenance records by installRecordId
    const maintenanceMap = maintenances.reduce((acc: any, maintenance: any) => {
      if (!acc[maintenance.installRecordId]) {
        acc[maintenance.installRecordId] = [];
      }
      acc[maintenance.installRecordId].push(maintenance);
      return acc;
    }, {});

    // Embed maintenance data into the corresponding install records
    const installRecordsWithMaintenance = result.rows.map((record: any) => {
      const maintenanceRecords = maintenanceMap[record.id] || [];
      return {
        ...record.dataValues,
        maintenances: maintenanceRecords,
      };
    });

    return res.status(HttpStatusCode.Ok).send({
      data: installRecordsWithMaintenance,
      total: result.count,
      page: pages,
      pageSize: pageSizes,
    });
  } catch (error) {
    return res
      .status(HttpStatusCode.InternalServerError)
      .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
  }
};
