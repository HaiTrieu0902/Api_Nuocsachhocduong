import express from 'express';
import routeRole from './role.route';
import routeUser from './user.route';
import routeCommon from './common.route';
import routeAuth from './auth.route';
import routeStatus from './status.route';
import routeCategoryProduct from './categoryProduct.route';
import routeCategoryMaintenance from './categoryMaintenance.route';
import routeNews from './news.role';
import routeProduct from './product.route';
import routeSchool from './school.role';
import routeInstallRecord from './installationRecord.route';
import routeMaintenance from './maintenance.route';

function route(app: express.Express) {
  /** AUTH . COMMON **/
  app.use('/api/common', routeCommon);
  app.use('/api/auth', routeAuth);
  app.use('/api/role', routeRole);

  /** Category **/
  app.use('/api/status', routeStatus);
  app.use('/api/category', routeCategoryProduct);
  app.use('/api/category', routeCategoryMaintenance);

  /** Entity **/
  app.use('/api/user', routeUser);
  app.use('/api/news', routeNews);
  app.use('/api/product', routeProduct);
  app.use('/api/school', routeSchool);
  app.use('/api/install', routeInstallRecord);
  app.use('/api/maintenance', routeMaintenance);
}
export default route;
