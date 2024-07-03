import { Request, Response } from 'express';
import { NotificationService } from '../service';
import { HttpStatusCode, SYSTEM_NOTIFICATION } from '../constant';
import Helper from '../helper/Helper';

const NotificationController = {
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
