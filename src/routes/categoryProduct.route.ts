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
  AuthMiddleware.RoleAdmin,
  CategoryProductController.CreateCategoryProduct,
);
routeCategoryProduct.put(
  '/update-category-product',
  AuthMiddleware.Authentication,
  AuthMiddleware.RoleAdmin,
  CategoryProductController.UpdateCategoryProduct,
);
routeCategoryProduct.delete(
  '/delete-category-product/:id',
  AuthMiddleware.Authentication,
  AuthMiddleware.RoleAdmin,
  CategoryProductController.DeleteCategoryProduct,
);
routeCategoryProduct.delete(
  '/delete-category-products',
  AuthMiddleware.Authentication,
  AuthMiddleware.RoleAdmin,
  CategoryProductController.DeleteMultipleCategoryProduct,
);

export default routeCategoryProduct;
