import { DataTypes, Model, Optional } from 'sequelize';
import connection from '@./../../src/config/connectDB';
import { v4 as uuidv4 } from 'uuid';

interface CategoryMaintenanceAttributes {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryMaintenanceInput extends Optional<CategoryMaintenanceAttributes, 'id'> {}
export interface CategoryMaintenanceOutput extends Required<CategoryMaintenanceAttributes> {}

class CategoryMaintenance
  extends Model<CategoryMaintenanceAttributes, CategoryMaintenanceInput>
  implements CategoryMaintenanceAttributes
{
  public id!: string;
  public code!: string;
  public name!: string;
  public description!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CategoryMaintenance.init(
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
    modelName: 'CategoryMaintenance',
    tableName: 'category_maintenance',
  },
);

export default CategoryMaintenance;
