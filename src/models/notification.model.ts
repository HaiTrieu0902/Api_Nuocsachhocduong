import { DataTypes, Model, Optional } from 'sequelize';
import connection from '@./../../src/config/connectDB';
import { v4 as uuidv4 } from 'uuid';
import User from './user.model';

interface DevicesAttributes {
  id?: string;
  accountId?: string;
  receiverId?: string;
  data?: any;
  type?: string;
  isRead?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DevicesInput extends Optional<DevicesAttributes, 'id'> {}
export interface DevicesOutput extends Required<DevicesAttributes> {}

class Devices extends Model<DevicesAttributes, DevicesInput> implements DevicesAttributes {
  public id!: string;
  public accountId!: string;
  public receiverId?: string;
  public data!: any;
  public type!: string;
  public isRead?: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Devices.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
    },
    accountId: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    receiverId: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    data: {
      allowNull: false,
      type: DataTypes.JSON,
    },
    type: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    isRead: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize: connection,
    underscored: false,
  },
);

User.hasMany(Devices, { foreignKey: 'accountId', as: 'device' });
Devices.belongsTo(User, { foreignKey: 'accountId', as: 'user' });
export default Devices;
