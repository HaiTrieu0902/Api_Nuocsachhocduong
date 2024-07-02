import { Request, Response } from 'express';
import { NotificationService } from '../service';
import { HttpStatusCode, SYSTEM_NOTIFICATION } from '../constant';
import Helper from '../helper/Helper';

const NotificationController = {
  CreateSingleNotiDevice: async (req: Request, res: Response): Promise<Response> => {
    try {
      const newNotification = await NotificationService.createSingleNotiDevice(req.body);
      return res
        .status(HttpStatusCode.Created)
        .send(Helper.ResponseData(HttpStatusCode.Created, SYSTEM_NOTIFICATION?.SUCCESS, newNotification));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },
};

export default NotificationController;
