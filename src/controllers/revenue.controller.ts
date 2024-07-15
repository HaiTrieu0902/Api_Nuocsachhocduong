import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { HttpStatusCode, SYSTEM_NOTIFICATION } from '../constant';
import { EMAINTENANCE, EROLE_ID, ESTATUS } from '../constant/enum';
import Helper from '../helper/Helper';
import Maintenance from '../models/maintenance.model';
import Product from '../models/product.model';
import School from '../models/school.model';
import User from '../models/user.model';
import InstallRecord from './../models/installRecord.model';

const RevenueController = {
  RevenueDashbroad: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { year, type } = req.query;
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);

      const schools = (await School.findAndCountAll()).count;
      const staffs = (await User.findAndCountAll({ where: { roleId: EROLE_ID.STAFF } })).count;

      const installRecords = await InstallRecord.findAndCountAll({
        where: {
          statusId: ESTATUS.COMPLETED,
          timeInstall: {
            [Op.between]: [startDate, endDate],
          },
        },
      });

      const maintenances = await Maintenance.findAndCountAll({
        where: {
          [Op.and]: [
            {
              statusId: ESTATUS?.COMPLETED,
            },
            { timeMaintenance: { [Op.between]: [startDate, endDate] } },
          ],
        },
      });

      const dataChartInstall = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, total: 0 }));
      installRecords?.rows?.forEach((record) => {
        const month = new Date(record.timeInstall).getMonth();
        dataChartInstall[month].total += type === 'product' ? record?.quantity : record.totalAmount;
      });

      const dataChartMaitenance = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, total: 0 }));
      let i = 0;
      maintenances.rows?.forEach((record) => {
        const month = new Date(record.timeMaintenance).getMonth();
        dataChartMaitenance[month].total += record.repairFees;
      });

      const data = {
        schools,
        staffs,
        installRecords: installRecords.count,
        maintenances: maintenances.count,
        totalInstallRecord: installRecords?.rows?.reduce(
          (acc, record) => acc + Number(type === 'product' ? record.quantity : record.totalAmount),
          0,
        ),
        totalMaitenance: maintenances?.rows?.reduce((acc, record) => acc + record.repairFees, 0),
        dataChartInstall: dataChartInstall,
        dataChartMaintenance: dataChartMaitenance,
      };
      return res
        .status(HttpStatusCode.Ok)
        .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION?.SUCCESS, data));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },

  InvestEquipmentBySchool: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { year, type, schoolId } = req.query;
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);

      const installRecords = await InstallRecord.findAndCountAll({
        where: {
          statusId: ESTATUS.COMPLETED,
          timeInstall: {
            [Op.between]: [startDate, endDate],
          },
          schoolId: schoolId as never,
        },
      });

      const maintenances = await Maintenance.findAndCountAll({
        where: {
          [Op.and]: [
            {
              statusId: ESTATUS?.COMPLETED,
            },
            { timeMaintenance: { [Op.between]: [startDate, endDate] } },
            { schoolId: schoolId as never },
          ],
        },
      });

      const dataChartInstall = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, total: 0 }));
      installRecords?.rows?.forEach((record) => {
        const month = new Date(record.timeInstall).getMonth();
        dataChartInstall[month].total += type === 'product' ? record?.quantity : record.totalAmount;
      });

      const data = {
        installRecords: installRecords.count,
        maintenances: maintenances.count,
        quantity: installRecords?.rows?.reduce(
          (acc, record) => acc + Number(type === 'product' ? record.quantity : record.totalAmount),
          0,
        ),
        totalAmount: installRecords?.rows?.reduce((acc, record) => acc + record.totalAmount, 0),
        totalMaitenance: maintenances?.rows?.reduce((acc, record) => acc + record.repairFees, 0),
        dataChartInstall: dataChartInstall,
      };
      return res
        .status(HttpStatusCode.Ok)
        .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION?.SUCCESS, data));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },

  InvestEquipmentsDetail: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { schoolId, productId, year } = req.query;
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);

      const maintenances = await Maintenance.findAll({
        where: {
          schoolId: schoolId as string,
          '$installRecord.product.id$': productId as string,
          // timeMaintenance: {
          //   [Op.between]: [startDate, endDate],
          // },
        },
        include: [
          {
            model: InstallRecord,
            as: 'installRecord',
            attributes: ['id', 'timeInstall', 'warrantyPeriod'],
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'name'],
              },
            ],
          },
        ],
      });
      const data = {
        maintenances,
      };
      return res
        .status(HttpStatusCode.Ok)
        .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION?.SUCCESS, data));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },
};

export default RevenueController;
