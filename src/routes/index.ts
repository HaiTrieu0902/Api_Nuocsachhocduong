import routeRole from './role.route';
import routeUser from './user.role';

function route(app: any) {
  app.use('/api/role', routeRole);
  app.use('/api/user', routeUser);
}
export default route;
