import { Request, Response } from 'express';
import { HttpStatusCode, SYSTEM_NOTIFICATION } from '../constant';
import Helper from '../helper/Helper';
import CategoryProduct from '../models/categoryProduct.model';
import Product from '../models/product.model';
import { ProductService } from '../service';
import { getListWithPaginationAssociations } from '../utils';

const ProductController = {
  GetListProduct: async (req: Request, res: Response): Promise<Response> => {
    const Parameters = {
      model: Product,
      subModel: CategoryProduct,
      attributes: ['id', 'code', 'name'],
      as: 'categoryProduct',
      exclude: ['categoryProductId'],
      conditions: { categoryProductId: req.query.categoryProductId },
      searchFields: ['code', 'name'],
    };
    return getListWithPaginationAssociations(req, res, Parameters);
  },

  CreateProduct: async (req: Request, res: Response): Promise<Response> => {
    try {
      const newProduct = await ProductService.createProduct(req.body, req);
      return res
        .status(HttpStatusCode.Created)
        .send(Helper.ResponseData(HttpStatusCode.Created, SYSTEM_NOTIFICATION?.SUCCESS, newProduct));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },

  GetDetailProduct: async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await ProductService.getDetailProduct(req, res as never);
      return res
        .status(HttpStatusCode.Ok)
        .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION?.SUCCESS, data));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },

  UpdateProduct: async (req: Request, res: Response): Promise<Response> => {
    try {
      const updateProduct = await ProductService.updateProduct(req.body, req);
      return res
        .status(HttpStatusCode.Ok)
        .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION?.SUCCESS, updateProduct));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },

  DeleteProduct: async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await ProductService.deleteProduct(req, res as never);
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

export default ProductController;
