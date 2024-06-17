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
  thumbnail?: string;
  accountId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NewsInput extends Optional<NewsAttributes, 'id'> {}
export interface NewsOutput extends Required<NewsAttributes> {}

class News extends Model<NewsAttributes, NewsInput> implements NewsAttributes {
  public id!: string;
  public title!: string;
  public type!: boolean;
  public content!: string;
  public thumbnail?: string;
  public accountId!: string;
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
    thumbnail: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    content: {
      allowNull: true,
      type: DataTypes.JSON,
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
User.hasMany(News, { foreignKey: 'accountId', as: 'news' });
News.belongsTo(User, { foreignKey: 'accountId', as: 'user' });
export default News;
