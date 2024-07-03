import { Request } from 'express';
import InstallRecord from '../models/installRecord.model';
import { INotificationMessage, IStatusInstallRecord, IinstallRecord } from '../types/interface';
import { MESSAGES_ERROR } from '../constant/error';
import Product from '../models/product.model';
import School from '../models/school.model';
import User from '../models/user.model';
import Status from '../models/status.model';
import { EROLE, EROLE_ID, ESTATUS } from '../constant/enum';
import NotificationService from './notifications.service';
import Devices from '../models/devices.model';

export const InstallRecordService = {
  createInstallRecord: async (newsData: IinstallRecord, req: Request) => {
    try {
      const news = await InstallRecord.create(
        {
          ...newsData,
        },
        { raw: true },
      );
      const product = await Product.findByPk(newsData?.productId);
      const school = await School.findByPk(newsData?.schoolId);

      const deviceAdmin = await Devices.findAndCountAll({
        include: [{ model: User, as: 'user', attributes: ['id', 'fullName', 'roleId'] }],
      });

      const adminDevices = deviceAdmin?.rows.filter(
        (device: any) => device?.user?.roleId === EROLE_ID.SUPER_ADMIN || device?.user?.roleId === EROLE_ID.ADMIN,
      );

      for (const device of adminDevices) {
        const notification = await NotificationService.createNotification({
          accountId: newsData?.accountId,
          receiverId: device?.accountId,
          data: {
            title: `${school?.name} có một yêu cầu lắp đặt ${product?.name}`,
            time: new Date(),
          },
          type: 'install',
        });
        const messageForStaff: INotificationMessage = {
          message: {
            token: device.token,
            notification: {
              title: 'Yêu cầu lắp đặt thiết bị',
              body: `${school?.name} có một yêu cầu lắp đặt ${product?.name}`,
              image: `http://localhost:${process.env.APP_PORT}/${product?.images ? product?.images[0] : ''}`,
            },
            data: { title: `${school?.name} có một yêu cầu lắp đặt ${product?.name}`, notiId: notification.id },
          },
        };
        await NotificationService.sendMessageForUser(messageForStaff);
      }
      return news.toJSON();
      // const notification = await NotificationService.createNotification({
      //   accountId: newsData?.accountId,
      //   receiverId: '68821b5d-176c-4e2d-a0ca-2cd7d0641d47',
      //   data: {
      //     title: `${school?.name} có một yêu cầu lắp đặt ${product?.name}`,
      //     time: new Date(),
      //   },
      //   type: 'install',
      // });
      // const messageForStaff: INotificationMessage = {
      //   message: {
      //     token:
      //       'cL7rEj0Ox_YA8Ll8zHhyS4:APA91bHS--EkL_PuNJVJ0E91lHLnVHD8ta1jAqPcdYeIf6XClZpeMlw6X2wFXHuOQl2--pMbJ2O6IWWEM95_wrv58YH1RjyFkE6j0CkpeAeUvF7LzoB0gr9Tjzne6nr3APtTMgR2cKI1',
      //     notification: {
      //       title: 'Yêu cầu lắp đặt',
      //       body: `${school?.name} có một yêu cầu lắp đặt ${product?.name}`,
      //     },
      //     data: { title: `${school?.name} có một yêu cầu lắp đặt ${product?.name}`, notiId: notification.id },
      //   },
      // };
      // await NotificationService.createSingleNotiDevice(messageForStaff);
      //await NotificationService.sendMessageForUser(messageForStaff);
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
        rows.timeInstall = new Date();
      }
      if (newsData?.role === EROLE.PRINCIPAL) {
        rows.statusId = newsData.statusId || ESTATUS.COMPLETED;
      }
      await rows?.save();
      return rows?.dataValues;
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
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
