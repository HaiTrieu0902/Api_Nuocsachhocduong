import { ProductController } from '../controllers';
import AuthMiddleware from '../middlewares/auth';

const express = require('express');
const routeProduct = express.Router();

routeProduct.get('/get-list-product', AuthMiddleware.Authentication, ProductController.GetListProduct);
routeProduct.get('/get-detail-product/:id', AuthMiddleware.Authentication, ProductController.GetDetailProduct);
routeProduct.post(
  '/create-product',
  AuthMiddleware.Authentication,
  AuthMiddleware.RoleAdmin,
  ProductController.CreateProduct,
);
routeProduct.put('/update-product', AuthMiddleware.Authentication, ProductController.UpdateProduct);
routeProduct.delete('/delete-product/:id', AuthMiddleware.Authentication, ProductController.DeleteProduct);

export default routeProduct;
