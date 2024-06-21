import { InstallRecordController } from '../controllers';
import AuthMiddleware from '../middlewares/auth';

const express = require('express');
const routeInstallRecord = express.Router();

routeInstallRecord.get(
  '/get-list-install',
  AuthMiddleware.Authentication,
  InstallRecordController.GetListInstallRecord,
);

routeInstallRecord.get(
  '/get-detail-install/:id',
  AuthMiddleware.Authentication,
  InstallRecordController.GetDetailInstallRecord,
);
routeInstallRecord.post(
  '/create-install',
  AuthMiddleware.Authentication,
  AuthMiddleware.RolePrincipal,
  InstallRecordController.CreateInstallRecord,
);
routeInstallRecord.put(
  '/update-install',
  AuthMiddleware.Authentication,
  AuthMiddleware.RolePrincipal,
  InstallRecordController.UpdateInstallRecord,
);
routeInstallRecord.delete(
  '/delete-install/:id',
  AuthMiddleware.Authentication,
  AuthMiddleware.RolePrincipal,
  InstallRecordController.DeleteInstallRecord,
);

export default routeInstallRecord;
