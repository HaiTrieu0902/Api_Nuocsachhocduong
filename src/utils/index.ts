import { Request, Response } from 'express';
import Helper from '../helper/Helper';
import { Parameters } from '../types/interface';
import { Op } from 'sequelize';
import { HttpStatusCode } from '../constant';
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
      transformedResult = result.rows.map((item: any) => {
        const { password, ...rest } = item.toJSON();
        return {
          ...rest,
          role: item.role?.role,
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
