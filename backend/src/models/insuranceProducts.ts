import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface InsuranceProductAttributes {
  id: number;
  product_name: string;
  product_type: string;
  coverage_amount: number;
  term_length?: number;
  monthly_premium: number;
  min_age: number;
  max_age: number;
  min_income?: number;
  max_income?: number;
  suitable_risk_tolerance: 'Low' | 'Medium' | 'High';
  min_dependents: number;
  max_dependents?: number;
  description?: string;
  features: string[];
  created_at?: Date;
  updated_at?: Date;
}

interface InsuranceProductCreationAttributes extends Optional<InsuranceProductAttributes, 'id' | 'created_at' | 'updated_at'> {}

export class InsuranceProduct extends Model<InsuranceProductAttributes, InsuranceProductCreationAttributes> implements InsuranceProductAttributes {
  public id!: number;
  public product_name!: string;
  public product_type!: string;
  public coverage_amount!: number;
  public term_length?: number;
  public monthly_premium!: number;
  public min_age!: number;
  public max_age!: number;
  public min_income?: number;
  public max_income?: number;
  public suitable_risk_tolerance!: 'Low' | 'Medium' | 'High';
  public min_dependents!: number;
  public max_dependents?: number;
  public description?: string;
  public features!: string[];
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

InsuranceProduct.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    product_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    coverage_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    term_length: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    monthly_premium: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },
    min_age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    max_age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    min_income: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    max_income: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    suitable_risk_tolerance: {
      type: DataTypes.ENUM('Low', 'Medium', 'High'),
      allowNull: false,
    },
    min_dependents: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    max_dependents: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    features: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: 'InsuranceProduct',
    tableName: 'insurance_products',
    indexes: [
      { fields: ['min_age', 'max_age'] },
      { fields: ['suitable_risk_tolerance'] },
      { fields: ['min_income', 'max_income'] },
    ],
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);
