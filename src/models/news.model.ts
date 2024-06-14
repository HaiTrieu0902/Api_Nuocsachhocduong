import { Association, DataTypes, Model, Optional } from 'sequelize';
import connection from '@./../../src/config/connectDB';
import { v4 as uuidv4 } from 'uuid';
import Role from './role.model';
import User from './user.model';

interface NewsAttributes {
  id?: string;
  title?: string;
  type?: boolean;
  content?: string;
  accountId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NewsInput extends Optional<NewsAttributes, 'id'> {}
export interface NewsOutput extends Required<NewsAttributes> {}

class News extends Model<NewsAttributes, NewsInput> implements NewsAttributes {
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

  // Thiết lập quan hệ belongsTo với User
  public readonly user?: User; // Định nghĩa thuộc tính user

  public static associations: {
    user: Association<News, User>; // Định nghĩa quan hệ với User
  };
}

News.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    type: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    content: {
      allowNull: true,
      type: DataTypes.STRING,
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

User.hasMany(News, { foreignKey: 'accountId', as: 'news' });
News.belongsTo(User, { foreignKey: 'accountId', as: 'user' });
export default User;
