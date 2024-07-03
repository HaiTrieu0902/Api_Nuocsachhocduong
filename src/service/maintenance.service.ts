import { Request, Response } from 'express';
import { MESSAGES_ERROR } from '../constant/error';
import CategoryMaintenance from '../models/categoryMaintenance.model';
import InstallRecord from '../models/installRecord.model';
import Maintenance from '../models/maintenance.model';
import School from '../models/school.model';
import Status from '../models/status.model';
import User from '../models/user.model';
import { IMaintenance, INotificationMessage, IStatusMaintenance } from '../types/interface';
import { EMAINTENANCE, EROLE, EROLE_ID, ESTATUS } from '../constant/enum';
import Product from '../models/product.model';
import Devices from '../models/devices.model';
import NotificationService from './notifications.service';

const includeAttributes = [
  {
    model: CategoryMaintenance,
    as: 'categoryMaintenance',
    attributes: ['id', 'name'],
  },
  {
    model: InstallRecord,
    as: 'installRecord',
    include: [
      {
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'code', 'price', 'images', 'discount'],
      },
    ],
  },
  {
    model: School,
    as: 'school',
    attributes: ['id', 'name', 'address', 'email', 'phoneNumber'],
  },
  {
    model: User,
    as: 'account',
    attributes: ['id', 'fullName', 'avatar'],
  },
  {
    model: User,
    as: 'staff',
    attributes: ['id', 'fullName', 'avatar'],
  },
  {
    model: Status,
    as: 'status',
    attributes: ['id', 'name'],
  },
];

export const MaintenanceService = {
  createMaintenance: async (newsData: IMaintenance) => {
    try {
      const listNews = await Maintenance.findAndCountAll({ where: { installRecordId: newsData?.installRecordId } });

      const check = listNews?.rows?.filter(
        (item) => item?.statusId === ESTATUS.INPROGRESS || item?.statusId === ESTATUS.PENDING,
      );

      if (check?.length > 0) {
        throw new Error(MESSAGES_ERROR.MAINTENANCE_INPROGRESS);
      }

      const school = await School.findByPk(newsData?.schoolId);

      const deviceAdmin = await Devices.findAndCountAll({
        include: [{ model: User, as: 'user', attributes: ['id', 'fullName', 'roleId'] }],
      });
      const adminDevices = deviceAdmin?.rows.filter(
        (device: any) => device?.user?.roleId === EROLE_ID.SUPER_ADMIN || device?.user?.roleId === EROLE_ID.ADMIN,
      );

      const news = await Maintenance.create(newsData, { raw: true });

      for (const device of adminDevices) {
        const notification = await NotificationService.createNotification({
          accountId: newsData?.accountId,
          receiverId: device?.accountId,
          data: {
            title: `${school?.name} có một yêu cầu ${
              newsData.categoryMaintenanceId === EMAINTENANCE.BD ? 'bảo dưỡng' : 'sửa chữa'
            } mới`,
            time: new Date(),
          },
          type: 'maintenance',
        });
        const messageForStaff: INotificationMessage = {
          message: {
            token: device.token,
            notification: {
              title: `Yêu cầu ${newsData.categoryMaintenanceId === EMAINTENANCE.BD ? 'bảo dưỡng' : 'sửa chữa'}`,
              body: `${school?.name} có một yêu cầu ${
                newsData.categoryMaintenanceId === EMAINTENANCE.BD ? 'bảo dưỡng' : 'sửa chữa'
              } mới`,
            },
            data: {
              title: `${school?.name} có một yêu cầu ${
                newsData.categoryMaintenanceId === EMAINTENANCE.BD ? 'bảo dưỡng' : 'sửa chữa'
              } mới`,
              notiId: notification.id,
            },
          },
        };
        await NotificationService.sendMessageForUser(messageForStaff);
      }
      return news.toJSON();
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  },

  getDetailMaintenance: async (req: Request) => {
    try {
      const { id } = req.params;
      const data = await Maintenance.findByPk(id, {
        attributes: {
          exclude: ['categoryMaintenanceId', 'accountId', 'installRecordId', 'staffId', 'schoolId', 'statusId'],
        },
        include: includeAttributes,
      });

      if (!data) {
        throw new Error(MESSAGES_ERROR.NOT_EXITS);
      }

      return data;
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  },

  updateMaintenance: async (newsData: IMaintenance) => {
    try {
      const news = await Maintenance.findByPk(newsData.id, {
        attributes: {
          exclude: ['categoryMaintenanceId', 'accountId', 'installRecordId', 'staffId', 'schoolId', 'statusId'],
        },
        include: includeAttributes,
      });

      if (!news) {
        throw new Error(MESSAGES_ERROR.NOT_EXITS);
      }

      Object.assign(news, newsData);
      await news.save();

      return news.dataValues;
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  },

  updateStatusMaintenance: async (newsData: IStatusMaintenance) => {
    try {
      const rows = await Maintenance.findByPk(newsData.id);
      if (!rows) {
        throw new Error(MESSAGES_ERROR.NOT_EXITS);
      }
      Object.assign(rows, newsData);
      if (newsData.staffId === rows.staffId) {
        rows.statusId = newsData.statusId as string;
        if (newsData.statusId === ESTATUS.COMPLETE) {
          rows.timeMaintenance = new Date();
        }
      }
      if (newsData.role === EROLE.PRINCIPAL) {
        rows.statusId = newsData.statusId || ESTATUS.COMPLETED;
      }

      await rows.save();
      return rows.dataValues;
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  },

  deleteMaintenance: async (req: Request) => {
    try {
      const { id } = req.params;
      const maintenance = await Maintenance.findByPk(id);
      if (!maintenance) {
        throw new Error(MESSAGES_ERROR.NOT_EXITS);
      }
      maintenance.isDelete = true;
      maintenance.statusId = ESTATUS.DELETED;
      await maintenance.save();
      return maintenance;
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  },
};

export default MaintenanceService;
