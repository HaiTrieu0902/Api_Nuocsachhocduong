import { Request, Response } from 'express';
import Role from '@../../../src/models/role.model';
import Helper from '../helper/Helper';
import { getListWithPagination } from '../utils';
import { HttpStatusCode, SYSTEM_NOTIFICATION } from '../constant';
import { MESSAGES_ERROR } from '../constant/error';

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
      return res
        .status(HttpStatusCode.Created)
        .send(Helper.ResponseData(HttpStatusCode.Created, SYSTEM_NOTIFICATION.ROLE_CREATE, newRole));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },

  DeleteRole: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const role = await Role.findByPk(id);
      role?.destroy();
      if (!role) {
        return res.status(HttpStatusCode.NotFound).send({
          status: HttpStatusCode.NotFound,
          message: MESSAGES_ERROR.ROLE_NOT_EXITS,
        });
      }
      return res
        .status(HttpStatusCode.Ok)
        .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION.SUCCESS, null));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },

  DeleteMultipleRoles: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { listId } = req.body;
      if (!listId || !Array.isArray(listId)) {
        return res
          .status(HttpStatusCode.BadRequest)
          .send(Helper.ResponseError(HttpStatusCode.BadRequest, MESSAGES_ERROR.INVALID, null));
      }
      const deletedCount = await Role.destroy({
        where: {
          id: listId,
        },
      });

      return res
        .status(HttpStatusCode.Ok)
        .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION.SUCCESS, deletedCount));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },

  UpdateRole: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id, role: newRoleValue } = req.body;
      const roleRes = await Role.findByPk(id);
      if (!roleRes) {
        return res
          .status(HttpStatusCode.NotFound)
          .send(Helper.ResponseError(HttpStatusCode.NotFound, MESSAGES_ERROR.ROLE_NOT_EXITS, null));
      }
      const existingRole = await Role.findOne({ where: { role: newRoleValue } });
      if (existingRole && existingRole.id !== id) {
        return res
          .status(HttpStatusCode.BadRequest)
          .send(Helper.ResponseError(HttpStatusCode.BadRequest, MESSAGES_ERROR.ROLE_HAS_EXITS, null));
      }
      roleRes.role = newRoleValue;
      await roleRes.save();
      return res
        .status(HttpStatusCode.Ok)
        .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION.SUCCESS, roleRes));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },
};

export default RoleController;
