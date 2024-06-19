import { Request, Response } from 'express';
import Product from '../models/product.model';
import { IProduct } from '../types/interface';
import CategoryProduct from '../models/categoryProduct.model';
import { MESSAGES_ERROR } from '../constant/error';

export const ProductService = {
  createProduct: async (productData: IProduct, req: Request) => {
    try {
      const product = await Product.create(
        {
          ...productData,
        },
        { raw: true },
      );
      //   product.toJSON();
      return product.toJSON();
    } catch (error) {
      throw error;
    }
  },

  getDetailProduct: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await Product.findOne({
        where: { id },
        include: [
          {
            model: CategoryProduct,
            as: 'categoryProduct',
            attributes: ['id', 'code', 'name'],
          },
        ],
      });
      if (!data) {
        throw MESSAGES_ERROR.NOT_EXITS;
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  updateProduct: async (productData: IProduct, req: Request) => {
    try {
      const product = await Product.findByPk(productData?.id);
      if (!product) {
        throw MESSAGES_ERROR.NOT_EXITS;
      }
      Object.assign(product as never, productData);
      await product?.save();
      return product?.dataValues;
    } catch (error) {
      throw error;
    }
  },

  deleteProduct: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);
      if (!product) {
        throw MESSAGES_ERROR.NOT_EXITS;
      }
      product.isDelete = true;
      await product?.save();
      return product;
    } catch (error) {
      throw error;
    }
  },
};

export default ProductService;
