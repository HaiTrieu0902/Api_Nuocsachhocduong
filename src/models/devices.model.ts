import { DataTypes, Model, Optional } from 'sequelize';
import connection from '@./../../src/config/connectDB';
import { v4 as uuidv4 } from 'uuid';
import User from './user.model';

interface DevicesAttributes {
  id?: string;
  accountId?: string;
  token?: string;
  type?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DevicesInput extends Optional<DevicesAttributes, 'id'> {}
export interface DevicesOutput extends Required<DevicesAttributes> {}

class Devices extends Model<DevicesAttributes, DevicesInput> implements DevicesAttributes {
  public id!: string;
  public accountId!: string;
  public token!: string;
  public type!: string;
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
    token: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    type: {
      allowNull: true,
      type: DataTypes.STRING,
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
