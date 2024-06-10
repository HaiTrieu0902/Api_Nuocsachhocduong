import { Association, DataTypes, Model, Optional } from 'sequelize';
import connection from '@./../../src/config/connectDB';
import { v4 as uuidv4 } from 'uuid';
import Role from './role.model';

interface UserAttributes {
  id?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string | any;
  roleId?: string;
  avatar?: string;
  isDelete?: boolean;
  codeOTP?: string;
  dob?: Date;
  schoolIds?: any[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserInput extends Optional<UserAttributes, 'id'> {}
export interface UserOutput extends Required<UserAttributes> {}

class User extends Model<UserAttributes, UserInput> implements UserAttributes {
  public id!: string;
  public fullName!: string;
  public email!: string;
  public phoneNumber!: string;
  public password!: string;
  public roleId!: string;
  public dob!: Date;
  public avatar!: string;
  public isDelete!: boolean;
  public codeOTP!: string;
  public schoolIds!: any[];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Thiết lập quan hệ belongsTo với Role
  public readonly role?: Role; // Định nghĩa thuộc tính role

  public static associations: {
    role: Association<User, Role>; // Định nghĩa quan hệ với Role
  };
}

User.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
    },
    fullName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    phoneNumber: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    roleId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    schoolIds: {
      allowNull: true,
      type: DataTypes.JSON,
    },
    avatar: {
      allowNull: true,
      type: DataTypes.STRING,
    },

    isDelete: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    codeOTP: {
      allowNull: true,
      type: DataTypes.STRING,
    },

    dob: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize: connection,
    underscored: false,
  },
);

User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
Role.hasMany(User, { foreignKey: 'roleId', as: 'user' });
export default User;
