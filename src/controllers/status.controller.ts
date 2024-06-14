import { Request, Response } from 'express';
import { HttpStatusCode, SYSTEM_NOTIFICATION } from '../constant';
import { MESSAGES_ERROR } from '../constant/error';
import Helper from '../helper/Helper';
import Status from '../models/status.model';
import { getListWithPagination } from '../utils';

const StatusController = {
  GetList: async (req: Request, res: Response): Promise<Response> => {
    return getListWithPagination(Status, req, res);
  },

  CreateStatus: async (req: Request, res: Response): Promise<Response> => {
    try {
      const newStatus = await Status.create(
        {
          ...req.body,
        },
        { raw: true },
      );
      return res
        .status(HttpStatusCode.Created)
        .send(Helper.ResponseData(HttpStatusCode.Created, SYSTEM_NOTIFICATION.SUCCESS, newStatus));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },

  DeleteStatus: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const status = await Status.findByPk(id);
      status?.destroy();
      if (!status) {
        return res.status(HttpStatusCode.NotFound).send({
          status: HttpStatusCode.NotFound,
          message: MESSAGES_ERROR.NOT_EXITS,
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

  DeleteMultipleStatus: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { listId } = req.body;
      if (!listId || !Array.isArray(listId)) {
        return res
          .status(HttpStatusCode.BadRequest)
          .send(Helper.ResponseError(HttpStatusCode.BadRequest, MESSAGES_ERROR.INVALID, null));
      }
      const deletedCount = await Status.destroy({
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

  UpdateStatus: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id, code, name, description } = req.body;
      const statusRes = await Status.findByPk(id);
      if (!statusRes) {
        return res
          .status(HttpStatusCode.NotFound)
          .send(Helper.ResponseError(HttpStatusCode.NotFound, MESSAGES_ERROR.ROLE_NOT_EXITS, null));
      }
      statusRes.code = code;
      statusRes.name = name;
      statusRes.description = description;
      await statusRes.save();
      return res
        .status(HttpStatusCode.Ok)
        .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION.SUCCESS, statusRes));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },
};

export default StatusController;
