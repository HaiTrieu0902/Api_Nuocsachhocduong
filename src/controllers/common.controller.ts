import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { HttpStatusCode } from '../constant';
import { MESSAGES_ERROR } from '../constant/error';

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
};

export default CommonController;
