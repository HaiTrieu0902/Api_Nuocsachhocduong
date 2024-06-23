import { Request } from 'express';
import InstallRecord from '../models/installRecord.model';
import { IStatusInstallRecord, IinstallRecord } from '../types/interface';
import { MESSAGES_ERROR } from '../constant/error';
import Product from '../models/product.model';
import School from '../models/school.model';
import User from '../models/user.model';
import Status from '../models/status.model';
import { EROLE, ESTATUS } from '../constant/enum';

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
      const data = await InstallRecord.findByPk(id, {
        attributes: { exclude: ['productId', 'schoolId', 'statusId', 'staffId', 'accountId'] },
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'code', 'price', 'images', 'discount'],
          },
          {
            model: School,
            as: 'school',
            attributes: ['id', 'name', 'address', 'email', 'phoneNumber'],
          },
          {
            model: User,
            as: 'account',
            attributes: ['id', 'fullName'],
          },
          {
            model: User,
            as: 'staff',
            attributes: ['id', 'fullName'],
          },
          {
            model: Status,
            as: 'status',
            attributes: ['id', 'name'],
          },
        ],
      });
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
      const news = await InstallRecord.findByPk(newsData?.id, {
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'code', 'price'],
          },
          {
            model: School,
            as: 'school',
            attributes: ['id', 'name', 'address', 'email', 'phoneNumber'],
          },
          {
            model: User,
            as: 'account',
            attributes: ['id', 'fullName'],
          },
          {
            model: User,
            as: 'staff',
            attributes: ['id', 'fullName'],
          },
          {
            model: Status,
            as: 'status',
            attributes: ['id', 'name'],
          },
        ],
        attributes: { exclude: ['productId', 'schoolId', 'statusId', 'staffId', 'accountId'] },
      });
      if (!news) {
        throw MESSAGES_ERROR.NOT_EXITS;
      }
      Object.assign(news as never, newsData);
      if (newsData?.staffId) {
        news.statusId = ESTATUS.INPROGRESS_INSTALL;
      }
      await news?.save();
      return news?.dataValues;
    } catch (error) {
      throw error;
    }
  },

  updateStatusInstallRecord: async (newsData: IStatusInstallRecord, req: Request) => {
    try {
      const rows = await InstallRecord.findByPk(newsData?.id);
      if (!rows) {
        throw MESSAGES_ERROR.NOT_EXITS;
      }
      Object.assign(rows as never, newsData);
      if (newsData?.staffId === rows?.staffId) {
        rows.statusId = newsData.statusId as string;
      }
      if (newsData?.role === EROLE.PRINCIPAL) {
        rows.statusId = newsData.statusId || ESTATUS.COMPLETED;
      }
      await rows?.save();
      return rows?.dataValues;
    } catch (error) {}
  },

  deleteInstallRecord: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const installRecord = await InstallRecord.findByPk(id);
      if (!installRecord) {
        throw MESSAGES_ERROR.NOT_EXITS;
      }
      installRecord.isDelete = true;
      installRecord.statusId = ESTATUS.DELETED;
      await installRecord?.save();
      return installRecord;
    } catch (error) {
      throw error;
    }
  },
};

export default InstallRecordService;
