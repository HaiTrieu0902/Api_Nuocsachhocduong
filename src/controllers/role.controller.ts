import { Request, Response } from 'express';
import Role from '@../../../src/models/role.model';

import Helper from '../helper/Helper';
import { getListWithPagination } from '../utils';

const RoleController = {
  GetList: async (req: Request, res: Response): Promise<Response> => {
    return getListWithPagination(Role, req, res);
  },

  CreateRole: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { role } = req.body;
      const newRole = await Role.create(
        {
          role,
        },
        { raw: true },
      );
      return res.status(201).send(Helper.ResponseData(201, 'Role created successfully', newRole));
    } catch (error) {
      return res.status(500).send(Helper.ResponseError(500, '', error));
    }
  },

  DeleteRole: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const role = await Role.findByPk(id);
      role?.destroy();
      if (!role) {
        return res.status(404).send({
          status: 404,
          message: 'Not found role',
        });
      }
      return res.status(200).send(Helper.ResponseData(200, 'Delete Role Successfully', null));
    } catch (error) {
      return res.status(500).send(Helper.ResponseError(500, '', error));
    }
  },

  DeleteMultipleRoles: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { listId } = req.body;
      if (!listId || !Array.isArray(listId)) {
        return res.status(400).send(Helper.ResponseError(400, 'Invalid listId format', null));
      }
      const deletedCount = await Role.destroy({
        where: {
          id: listId,
        },
      });

      return res.status(200).send(Helper.ResponseData(200, 'Delete List Role Successfully', deletedCount));
    } catch (error) {
      return res.status(500).send(Helper.ResponseError(500, '', error));
    }
  },

  UpdateRole: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id, role: newRoleValue } = req.body;
      const roleRes = await Role.findByPk(id);
      if (!roleRes) {
        return res.status(404).send(Helper.ResponseError(404, 'Role not found', null));
      }
      const existingRole = await Role.findOne({ where: { role: newRoleValue } });
      if (existingRole && existingRole.id !== id) {
        return res.status(400).send(Helper.ResponseError(400, 'Role already exists', null));
      }
      roleRes.role = newRoleValue;
      await roleRes.save();
      return res.status(200).send(Helper.ResponseData(200, 'Update Role Successfully', roleRes));
    } catch (error) {
      return res.status(500).send(Helper.ResponseError(500, '', error));
    }
  },
};

export default RoleController;
