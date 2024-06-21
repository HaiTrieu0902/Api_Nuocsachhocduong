import connection from '@./../../src/config/connectDB';
import { Association, DataTypes, Model, Optional } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import User from './user.model';

interface SchoolAttributes {
  id?: string;
  name?: string;
  address?: string;
  email?: string;
  phoneNumber?: number;
  isDelete?: boolean;
  accountId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SchoolInput extends Optional<SchoolAttributes, 'id'> {}
export interface SchoolOutput extends Required<SchoolAttributes> {}

class School extends Model<SchoolAttributes, SchoolInput> implements SchoolAttributes {
  public id!: string;
  public name?: string;
  public address?: string;
  public email?: string;
  public phoneNumber?: number;
  public isDelete?: boolean;
  public accountId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Thiết lập quan hệ belongsTo với User
  public readonly user?: User; // Định nghĩa thuộc tính user

  public static associations: {
    user: Association<School, User>; // Định nghĩa quan hệ với User
  };
}

School.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    address: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    phoneNumber: {
      allowNull: false,
      type: DataTypes.NUMBER,
    },
    isDelete: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    accountId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
  },
  {
    sequelize: connection,
    underscored: false,
  },
);

// Define associations
User.hasMany(School, { foreignKey: 'accountId', as: 'school' });
School.belongsTo(User, { foreignKey: 'accountId', as: 'user' });
export default School;
