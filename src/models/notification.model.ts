import { DataTypes, Model, Optional } from 'sequelize';
import connection from '@./../../src/config/connectDB';
import { v4 as uuidv4 } from 'uuid';
import User from './user.model';

interface NotificationAttributes {
  id?: string;
  accountId?: string;
  receiverId?: string;
  data?: any;
  type?: string;
  isRead?: boolean;
  isReadAdmin?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NotificationInput extends Optional<NotificationAttributes, 'id'> {}
export interface NotificationOutput extends Required<NotificationAttributes> {}

class Notification extends Model<NotificationAttributes, NotificationInput> implements NotificationAttributes {
  public id!: string;
  public accountId!: string;
  public receiverId?: string;
  public data!: any;
  public type!: string;
  public isRead?: boolean;
  public isReadAdmin?: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Notification.init(
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
      references: {
        model: 'users',
        key: 'id',
      },
    },
    receiverId: {
      allowNull: false,
      type: DataTypes.STRING,
      references: {
        model: 'users',
        key: 'id',
      },
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
    isReadAdmin: {
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

User.hasMany(Notification, { foreignKey: 'accountId', as: 'accountNotification' });
Notification.belongsTo(User, { foreignKey: 'accountId', as: 'account' });

User.hasMany(Notification, { foreignKey: 'receiverId', as: 'receiverNotification' });
Notification.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });
export default Notification;
