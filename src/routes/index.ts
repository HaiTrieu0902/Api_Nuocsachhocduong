import express from 'express';
import routeRole from './role.route';
import routeUser from './user.route';
import routeCommon from './common.route';
import routeAuth from './auth.route';
import routeStatus from './status.route';
import routeCategoryProduct from './categoryProduct.route';
import routeCategoryMaintenance from './categoryMaintenance.route';

function route(app: express.Express) {
  app.use('/api/role', routeRole);
  app.use('/api/status', routeStatus);
  app.use('/api/category', routeCategoryProduct);
  app.use('/api/category', routeCategoryMaintenance);
  app.use('/api/user', routeUser);
  app.use('/api/common', routeCommon);
  app.use('/api/auth', routeAuth);
}
export default route;
