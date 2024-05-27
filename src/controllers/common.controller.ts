import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

const CommonController = {
  uploadImages: (req: Request, res: Response) => {
    res.send({
      status: 200,
      data: req.files,
    });
  },

  getImage: (req: Request, res: Response) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, '../uploads', fileName);

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).send({ message: 'File not found' });
      }
      return res.sendFile(filePath);
    });
  },
};

export default CommonController;
