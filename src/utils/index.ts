// const nodeMailer = require('nodemailer');

import { Request, Response } from 'express';
import Helper from '../helper/Helper';
import { Parameters } from '../types/commom';
const dotenv = require('dotenv');
dotenv.config();

/** handle get list with Panigation */
export const getListWithPagination = async (Model: any, req: Request, res: Response): Promise<Response> => {
  try {
    const { page, pageSize } = req.query;
    const pages = page ? Number(page) : 1;
    const pageSizes = pageSize ? Number(pageSize) : 10;
    const offset = (pages - 1) * pageSizes;
    const result = await Model.findAndCountAll(
      page
        ? {
            offset,
            limit: Number(pageSize),
          }
        : {},
    );
    return res.status(200).send({
      data: result?.rows,
      total: result?.count,
    });
  } catch (error) {
    return res.status(500).send(Helper.ResponseError(500, '', error));
  }
};

/** handle get list with Panigation association */
export const getListWithPaginationAssociations = async (
  req: Request,
  res: Response,
  Parameters: Parameters,
): Promise<Response> => {
  try {
    const { page, pageSize } = req.query;
    const pages = page ? Number(page) : 1;
    const pageSizes = pageSize ? Number(pageSize) : 10;
    const offset = (pages - 1) * pageSizes;

    const result = await Parameters?.model.findAndCountAll({
      include: [{ model: Parameters?.subModel, as: Parameters?.as, attributes: Parameters?.attributes }],
      attributes: { exclude: Parameters?.exclude },
      offset,
      limit: page ? Number(pageSize) : undefined,
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

    return res.status(200).send({
      data: transformedResult || result.rows,
      total: result.count,
    });
  } catch (error) {
    return res.status(500).send(Helper.ResponseError(500, '', error));
  }
};
