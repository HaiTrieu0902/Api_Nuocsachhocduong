import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { HttpStatusCode, SYSTEM_NOTIFICATION } from '../constant';
import { MESSAGES_ERROR } from '../constant/error';
import Devices from '../models/devices.model';
import Helper from '../helper/Helper';
import { getListWithPagination } from '../utils';

const CommonController = {
  uploadImages: (req: Request, res: Response) => {
    res.send({
      status: HttpStatusCode.Ok,
      data: req.files,
    });
  },

  getImage: (req: Request, res: Response) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, '../uploads', fileName);

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(HttpStatusCode.NotFound).send({ message: MESSAGES_ERROR.IMAGE_NOT_FOUND });
      }
      return res.sendFile(filePath);
    });
  },

  // register devices
  GetListDevices: async (req: Request, res: Response): Promise<Response> => {
    const Parameters = {
      model: Devices,
      searchFields: ['type'],
    };

    return getListWithPagination(Parameters, req, res);
  },

  CreatDevices: async (req: Request, res: Response): Promise<Response> => {
    try {
      const newDevice = await Devices.create({ ...req.body }, { raw: true });
      return res
        .status(HttpStatusCode.Created)
        .send(Helper.ResponseData(HttpStatusCode.Created, SYSTEM_NOTIFICATION?.SUCCESS, newDevice));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },
  RemoveDevices: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const device = await Devices.findByPk(id);
      device?.destroy();
      return res
        .status(HttpStatusCode.Created)
        .send(Helper.ResponseData(HttpStatusCode.Created, SYSTEM_NOTIFICATION?.SUCCESS, device));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },
};

export default CommonController;
