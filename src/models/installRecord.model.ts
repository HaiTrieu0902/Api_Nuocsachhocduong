'use strict';

import { Association, DataTypes, Model, Optional } from 'sequelize';
import connection from '@./../../src/config/connectDB';
import Product from './product.model';
import School from './school.model';
import User from './user.model';
import Status from './status.model';

interface InstallRecordAttributes {
  id?: string;
  productId?: string;
  quantity?: number;
  schoolId?: string;
  staffId?: string;
  accountId?: string;
  timeInstall?: Date;
  statusId?: string;
  totalAmount?: number;
  isDelete?: boolean;
  warrantyPeriod?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InstallRecordInput extends Optional<InstallRecordAttributes, 'id'> {}
export interface InstallRecordOutput extends Required<InstallRecordAttributes> {}

class InstallRecord extends Model<InstallRecordAttributes, InstallRecordInput> implements InstallRecordAttributes {
  public id!: string;
  public productId!: string;
  public quantity!: number;
  public schoolId!: string;
  public staffId!: string;
  public accountId!: string;
  public timeInstall!: Date;
  public statusId!: string;
  public isDelete!: boolean;
  public totalAmount!: number;
  public warrantyPeriod!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Define associations here
  public readonly product?: Product;
  public readonly school?: School;
  public readonly staff?: User;
  public readonly account?: User;
  public readonly status?: Status;

  public static associations: {
    product: Association<InstallRecord, Product>;
    school: Association<InstallRecord, School>;
    staff: Association<InstallRecord, User>;
    account: Association<InstallRecord, User>;
    status: Association<InstallRecord, Status>;
  };
}

InstallRecord.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    productId: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'products',
        key: 'id',
      },
    },
    quantity: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    schoolId: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'schools',
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
    accountId: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    timeInstall: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    statusId: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'status',
        key: 'id',
      },
    },
    totalAmount: {
      allowNull: false,
      type: DataTypes.DOUBLE,
    },
    warrantyPeriod: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    isDelete: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize: connection,
    tableName: 'installRecords',
    underscored: false,
  },
);

// Define the associations as per your requirements
InstallRecord.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(InstallRecord, { foreignKey: 'productId', as: 'installRecords' });

InstallRecord.belongsTo(School, { foreignKey: 'schoolId', as: 'school' });
School.hasMany(InstallRecord, { foreignKey: 'schoolId', as: 'installRecords' });

InstallRecord.belongsTo(User, { foreignKey: 'staffId', as: 'staff' });
User.hasMany(InstallRecord, { foreignKey: 'staffId', as: 'staffInstallRecords' });

InstallRecord.belongsTo(User, { foreignKey: 'accountId', as: 'account' });
User.hasMany(InstallRecord, { foreignKey: 'accountId', as: 'accountInstallRecords' });

InstallRecord.belongsTo(Status, { foreignKey: 'statusId', as: 'status' });
Status.hasMany(InstallRecord, { foreignKey: 'statusId', as: 'installRecords' });

export default InstallRecord;
