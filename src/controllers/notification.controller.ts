import { Request, Response } from 'express';
import { NotificationService } from '../service';
import { HttpStatusCode, SYSTEM_NOTIFICATION } from '../constant';
import Helper from '../helper/Helper';
import { getPaginatedListMutiplieModel } from '../utils';
import Notification from '../models/notification.model';
import User from '../models/user.model';

const NotificationController = {
  GetListNotification: async (req: Request, res: Response): Promise<Response> => {
    const Parameters = {
      model: Notification,
      searchFields: ['data'],
      conditions: {
        accountId: req.query.accountId,
        receiverId: req.query.receiverId,
      },
      attributes: {
        exclude: ['accountId', 'receiverId'],
      },
      include: [
        {
          model: User,
          as: 'account',
          attributes: ['id', 'fullName', 'avatar'],
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'fullName'],
        },
      ],
    };
    return getPaginatedListMutiplieModel(Parameters, req, res);
  },
  CreateSingleNotiDevice: async (req: Request, res: Response): Promise<Response> => {
    try {
      const newNotification = await NotificationService.createSingleNotiDevice(req.body);
      return res
        .status(HttpStatusCode.Ok)
        .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION?.SUCCESS, newNotification));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },

  CreateNotification: async (req: Request, res: Response): Promise<Response> => {
    try {
      const newNotification = await NotificationService.createNotification(req.body);
      return res
        .status(HttpStatusCode.Created)
        .send(Helper.ResponseData(HttpStatusCode.Created, SYSTEM_NOTIFICATION?.SUCCESS, newNotification));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },

  ReadNotification: async (req: Request, res: Response): Promise<Response> => {
    try {
      const notification = await NotificationService.readNotification(req, res);
      return res
        .status(HttpStatusCode.Ok)
        .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION?.SUCCESS, notification));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },

  DeleteNotification: async (req: Request, res: Response): Promise<Response> => {
    try {
      const notification = await NotificationService.deleteNotification(req, res);
      return res
        .status(HttpStatusCode.Ok)
        .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION?.SUCCESS, notification));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },
};

export default NotificationController;
