import routeRole from './role.route';

function route(app: any) {
  app.use('/api/role', routeRole);
}
export default route;
