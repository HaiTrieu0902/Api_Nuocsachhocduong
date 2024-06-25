import { MaintenanceController } from '../controllers';
import AuthMiddleware from '../middlewares/auth';

const express = require('express');
const routeMaintenance = express.Router();

routeMaintenance.get('/get-list-maintenance', AuthMiddleware.Authentication, MaintenanceController.GetListMaintenance);

routeMaintenance.get(
  '/get-detail-maintenance/:id',
  AuthMiddleware.Authentication,
  MaintenanceController.GetDetailMaintenance,
);
routeMaintenance.post(
  '/create-maintenance',
  AuthMiddleware.Authentication,
  AuthMiddleware.RolePrincipal,
  MaintenanceController.CreateMaintenance,
);

routeMaintenance.put(
  '/update-maintenance',
  AuthMiddleware.Authentication,
  AuthMiddleware.RolePrincipal,
  MaintenanceController.UpdateMaintenance,
);

routeMaintenance.put(
  '/update-status-maintenance',
  AuthMiddleware.Authentication,
  MaintenanceController.UpdateStatusMaintenance,
);

routeMaintenance.delete(
  '/delete-maintenance/:id',
  AuthMiddleware.Authentication,
  AuthMiddleware.RolePrincipal,
  MaintenanceController.DeleteMaintenance,
);

export default routeMaintenance;
