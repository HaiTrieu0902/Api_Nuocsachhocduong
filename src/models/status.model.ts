import { DataTypes, Model, Optional } from 'sequelize';
import connection from '@./../../src/config/connectDB';
import { v4 as uuidv4 } from 'uuid';

interface StatusAttributes {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StatusInput extends Optional<StatusAttributes, 'id'> {}
export interface StatusOutput extends Required<StatusAttributes> {}

class Status extends Model<StatusAttributes, StatusInput> implements StatusAttributes {
  public id!: string;
  public code!: string;
  public name!: string;
  public description!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Status.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
    },
    code: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    description: {
      allowNull: true,
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: connection,
    underscored: false,
    modelName: 'status',
    tableName: 'status',
  },
);

export default Status;
