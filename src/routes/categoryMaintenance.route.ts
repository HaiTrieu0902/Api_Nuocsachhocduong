import { CategoryMaintenanceController } from '../controllers';
import AuthMiddleware from '../middlewares/auth';
const express = require('express');
const routeCategoryMaintenance = express.Router();

routeCategoryMaintenance.get(
  '/get-list-category-maintenance',
  AuthMiddleware.Authentication,
  CategoryMaintenanceController.GetList,
);
routeCategoryMaintenance.post(
  '/create-category-maintenance',
  AuthMiddleware.Authentication,
  AuthMiddleware.SuperAdmin,
  CategoryMaintenanceController.CreateCategoryMaintenance,
);
routeCategoryMaintenance.put(
  '/update-category-maintenance',
  AuthMiddleware.Authentication,
  AuthMiddleware.SuperAdmin,
  CategoryMaintenanceController.UpdateCategoryMaintenance,
);
routeCategoryMaintenance.delete(
  '/delete-category-maintenance/:id',
  AuthMiddleware.Authentication,
  AuthMiddleware.SuperAdmin,
  CategoryMaintenanceController.DeleteCategoryMaintenance,
);
routeCategoryMaintenance.delete(
  '/delete-category-maintenances',
  AuthMiddleware.Authentication,
  AuthMiddleware.SuperAdmin,
  CategoryMaintenanceController.DeleteMultipleCategoryMaintenance,
);

export default routeCategoryMaintenance;
