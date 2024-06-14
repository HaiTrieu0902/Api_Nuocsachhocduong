import { CategoryProductController } from '../controllers';
import AuthMiddleware from '../middlewares/auth';
const express = require('express');
const routeCategoryProduct = express.Router();

routeCategoryProduct.get(
  '/get-list-category-product',
  AuthMiddleware.Authentication,
  CategoryProductController.GetList,
);
routeCategoryProduct.post(
  '/create-category-product',
  AuthMiddleware.Authentication,
  AuthMiddleware.SuperAdmin,
  CategoryProductController.CreateCategoryProduct,
);
routeCategoryProduct.put(
  '/update-category-product',
  AuthMiddleware.Authentication,
  AuthMiddleware.SuperAdmin,
  CategoryProductController.UpdateCategoryProduct,
);
routeCategoryProduct.delete(
  '/delete-category-product/:id',
  AuthMiddleware.Authentication,
  AuthMiddleware.SuperAdmin,
  CategoryProductController.DeleteCategoryProduct,
);
routeCategoryProduct.delete(
  '/delete-category-products',
  AuthMiddleware.Authentication,
  AuthMiddleware.SuperAdmin,
  CategoryProductController.DeleteMultipleCategoryProduct,
);

export default routeCategoryProduct;
