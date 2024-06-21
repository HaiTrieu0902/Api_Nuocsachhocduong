import { Request } from 'express';
import InstallRecord from '../models/installRecord.model';
import { IinstallRecord } from '../types/interface';
import { MESSAGES_ERROR } from '../constant/error';

export const InstallRecordService = {
  createInstallRecord: async (newsData: IinstallRecord, req: Request) => {
    try {
      const news = await InstallRecord.create(
        {
          ...newsData,
        },
        { raw: true },
      );
      //   news.toJSON();
      return news.toJSON();
    } catch (error) {
      throw error;
    }
  },

  getDetailInstallRecord: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await InstallRecord.findByPk(id);
      if (!data) {
        throw MESSAGES_ERROR.NOT_EXITS;
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  updateInstallRecord: async (newsData: IinstallRecord, req: Request) => {
    try {
      const news = await InstallRecord.findByPk(newsData?.id);
      if (!news) {
        throw MESSAGES_ERROR.NOT_EXITS;
      }
      Object.assign(news as never, newsData);
      await news?.save();
      return news?.dataValues;
    } catch (error) {
      throw error;
    }
  },

  deleteInstallRecord: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const installRecord = await InstallRecord.findByPk(id);
      if (!installRecord) {
        throw MESSAGES_ERROR.NOT_EXITS;
      }
      const res = await installRecord?.destroy();
      return res;
    } catch (error) {
      throw error;
    }
  },
};

export default InstallRecordService;
