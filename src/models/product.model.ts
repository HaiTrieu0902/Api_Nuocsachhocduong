import connection from '@./../../src/config/connectDB';
import { Association, DataTypes, Model, Optional } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import CategoryProduct from './categoryProduct.model';

interface ProductAttributes {
  id?: string;
  code?: string;
  name?: string;
  price?: number;
  discount?: number;
  content?: string;
  categoryProductId?: string;
  images?: any[];
  isDelete?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductInput extends Optional<ProductAttributes, 'id'> {}
export interface ProductOutput extends Required<ProductAttributes> {}

class Product extends Model<ProductAttributes, ProductInput> implements ProductAttributes {
  public id!: string;
  public code?: string;
  public name?: string;
  public price?: number;
  public discount?: number;
  public content?: string;
  public isDelete?: boolean;
  public categoryProductId?: string;
  public images?: any[];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Thiết lập quan hệ belongsTo với CategoryProductId
  public readonly categoryProduct?: CategoryProduct; // Định nghĩa thuộc tính CategoryProductId
  public static associations: {
    categoryProduct: Association<Product, CategoryProduct>; // Định nghĩa quan hệ với CategoryProductId
  };
}

Product.init(
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
    price: {
      allowNull: false,
      type: DataTypes.NUMBER,
    },
    discount: {
      allowNull: false,
      type: DataTypes.NUMBER,
    },
    content: {
      allowNull: false,
      type: DataTypes.JSON,
    },
    categoryProductId: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    isDelete: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    images: {
      allowNull: true,
      type: DataTypes.JSON,
    },
  },
  {
    sequelize: connection,
    underscored: false,
  },
);
CategoryProduct.hasMany(Product, { foreignKey: 'categoryProductId', as: 'product' });
Product.belongsTo(CategoryProduct, { foreignKey: 'categoryProductId', as: 'categoryProduct' });
export default Product;
