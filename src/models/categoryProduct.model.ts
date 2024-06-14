import { DataTypes, Model, Optional } from 'sequelize';
import connection from '@./../../src/config/connectDB';
import { v4 as uuidv4 } from 'uuid';

interface CategoryProductAttributes {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryProductInput extends Optional<CategoryProductAttributes, 'id'> {}
export interface CategoryProductOutput extends Required<CategoryProductAttributes> {}

class CategoryProduct
  extends Model<CategoryProductAttributes, CategoryProductInput>
  implements CategoryProductAttributes
{
  public id!: string;
  public code!: string;
  public name!: string;
  public description!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CategoryProduct.init(
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
    modelName: 'CategoryProduct',
    tableName: 'category_product',
  },
);

export default CategoryProduct;
