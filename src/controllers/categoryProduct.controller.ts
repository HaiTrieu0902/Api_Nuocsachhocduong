import { Request, Response } from 'express';
import { HttpStatusCode, SYSTEM_NOTIFICATION } from '../constant';
import { MESSAGES_ERROR } from '../constant/error';
import Helper from '../helper/Helper';
import { getListWithPagination } from '../utils';
import CategoryProduct from '../models/categoryProduct.model';

const CategoryProductController = {
  GetList: async (req: Request, res: Response): Promise<Response> => {
    return getListWithPagination(CategoryProduct, req, res);
  },

  CreateCategoryProduct: async (req: Request, res: Response): Promise<Response> => {
    try {
      const newCategoryProduct = await CategoryProduct.create(
        {
          ...req.body,
        },
        { raw: true },
      );
      return res
        .status(HttpStatusCode.Created)
        .send(Helper.ResponseData(HttpStatusCode.Created, SYSTEM_NOTIFICATION.SUCCESS, newCategoryProduct));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },

  DeleteCategoryProduct: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const category = await CategoryProduct.findByPk(id);
      category?.destroy();
      if (!category) {
        return res.status(HttpStatusCode.NotFound).send({
          status: HttpStatusCode.NotFound,
          message: MESSAGES_ERROR.NOT_EXITS,
        });
      }
      return res
        .status(HttpStatusCode.Ok)
        .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION.SUCCESS, null));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },

  DeleteMultipleCategoryProduct: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { listId } = req.body;
      if (!listId || !Array.isArray(listId)) {
        return res
          .status(HttpStatusCode.BadRequest)
          .send(Helper.ResponseError(HttpStatusCode.BadRequest, MESSAGES_ERROR.INVALID, null));
      }
      const deletedCount = await CategoryProduct.destroy({
        where: {
          id: listId,
        },
      });

      return res
        .status(HttpStatusCode.Ok)
        .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION.SUCCESS, deletedCount));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },

  UpdateCategoryProduct: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id, code, name, description } = req.body;
      const categoryRes = await CategoryProduct.findByPk(id);
      if (!categoryRes) {
        return res
          .status(HttpStatusCode.NotFound)
          .send(Helper.ResponseError(HttpStatusCode.NotFound, MESSAGES_ERROR.ROLE_NOT_EXITS, null));
      }
      categoryRes.code = code;
      categoryRes.name = name;
      categoryRes.description = description;
      await categoryRes.save();
      return res
        .status(HttpStatusCode.Ok)
        .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION.SUCCESS, categoryRes));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },
};

export default CategoryProductController;
