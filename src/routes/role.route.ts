import { RoleController } from '../controllers';
const express = require('express');
const routeRole = express.Router();

routeRole.get('/get-list-role', RoleController.GetList);
routeRole.post('/create-role', RoleController.CreateRole);
routeRole.put('/update-role', RoleController.UpdateRole);
routeRole.delete('/delete-role/:id', RoleController.DeleteRole);
routeRole.delete('/delete-roles', RoleController.DeleteMultipleRoles);

export default routeRole;
