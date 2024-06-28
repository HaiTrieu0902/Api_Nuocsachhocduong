'use strict';

import connection from '@./../../src/config/connectDB';
import { Association, DataTypes, Model, Optional } from 'sequelize';
import CategoryMaintenance from './categoryMaintenance.model';
import InstallRecord from './installRecord.model';
import Product from './product.model';
import School from './school.model';
import Status from './status.model';
import User from './user.model';

interface MaintenanceAttributes {
  id?: string;
  categoryMaintenanceId?: string;
  accountId?: string;
  staffId?: string;
  installRecordId?: string;
  schoolId?: string;
  statusId?: string;
  title?: string;
  reason?: string;
  reasonRepair?: string;
  solution?: string;
  repairFees?: number;
  timeMaintenance?: Date;
  images_request?: any[];
  images_response?: any[];
  isDelete?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MaintenanceInput extends Optional<MaintenanceAttributes, 'id'> {}
export interface MaintenanceOutput extends Required<MaintenanceAttributes> {}

class Maintenance extends Model<MaintenanceAttributes, MaintenanceInput> implements MaintenanceAttributes {
  public id!: string;
  public categoryMaintenanceId!: string;
  public accountId!: string;
  public staffId!: string;
  public installRecordId!: string;
  public schoolId!: string;
  public statusId!: string;
  public title!: string;
  public reason!: string;
  public reasonRepair?: string;
  public solution?: string;
  public repairFees!: number;
  public timeMaintenance!: Date;
  public images_request!: any[];
  public images_response!: any[];
  public isDelete!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Define associations here
  public readonly installRecord?: InstallRecord;
  public readonly school?: School;
  public readonly staff?: User;
  public readonly account?: User;
  public readonly status?: Status;

  public static associations: {
    installRecord: Association<Maintenance, InstallRecord>;
    categoryMaintenance: Association<Maintenance, CategoryMaintenance>;
    school: Association<Maintenance, School>;
    staff: Association<Maintenance, User>;
    account: Association<Maintenance, User>;
    status: Association<Maintenance, Status>;
  };
}

Maintenance.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    categoryMaintenanceId: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'category_maintenance',
        key: 'id',
      },
    },
    accountId: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    staffId: {
      allowNull: true,
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    installRecordId: {
      allowNull: true,
      type: DataTypes.UUID,
      references: {
        model: 'installRecords',
        key: 'id',
      },
    },
    schoolId: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'schools',
        key: 'id',
      },
    },
    statusId: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'status',
        key: 'id',
      },
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    reason: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    reasonRepair: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    solution: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    repairFees: {
      allowNull: true,
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    timeMaintenance: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    images_request: {
      allowNull: true,
      type: DataTypes.JSON,
    },
    images_response: {
      allowNull: true,
      type: DataTypes.JSON,
    },
    isDelete: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize: connection,
    tableName: 'maintenance',
    underscored: false,
  },
);

// Define the associations as per your requirements
Maintenance.belongsTo(InstallRecord, { foreignKey: 'installRecordId', as: 'installRecord' });
InstallRecord.hasMany(Maintenance, { foreignKey: 'installRecordId', as: 'maintenance' });

Maintenance.belongsTo(School, { foreignKey: 'schoolId', as: 'school' });
School.hasMany(Maintenance, { foreignKey: 'schoolId', as: 'maintenance' });

Maintenance.belongsTo(User, { foreignKey: 'staffId', as: 'staff' });
User.hasMany(Maintenance, { foreignKey: 'staffId', as: 'staffMaintenance' });

Maintenance.belongsTo(User, { foreignKey: 'accountId', as: 'account' });
User.hasMany(Maintenance, { foreignKey: 'accountId', as: 'accountMaintenance' });

Maintenance.belongsTo(Status, { foreignKey: 'statusId', as: 'status' });
Status.hasMany(Maintenance, { foreignKey: 'statusId', as: 'maintenance' });

Maintenance.belongsTo(CategoryMaintenance, { foreignKey: 'categoryMaintenanceId', as: 'categoryMaintenance' });
CategoryMaintenance.hasMany(Maintenance, { foreignKey: 'categoryMaintenanceId', as: 'maintenance' });

export default Maintenance;
