import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './user';

interface UserDataAttributes {
  id: number;
  user_id: number;
  age: number;
  income: number;
  dependents: number;
  risk_tolerance: 'Low' | 'Medium' | 'High';
  created_at?: Date;
  updated_at?: Date;
}

interface UserDataCreationAttributes extends Optional<UserDataAttributes, 'id' | 'created_at' | 'updated_at'> {}

export class UserData extends Model<UserDataAttributes, UserDataCreationAttributes> implements UserDataAttributes {
  public id!: number;
  public user_id!: number;
  public age!: number;
  public income!: number;
  public dependents!: number;
  public risk_tolerance!: 'Low' | 'Medium' | 'High';
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

UserData.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 18,
        max: 100,
      },
    },
    income: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    dependents: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    risk_tolerance: {
      type: DataTypes.ENUM('Low', 'Medium', 'High'),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'UserData',
    tableName: 'user_data',
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['created_at'],
      },
    ],
  }
);

User.hasMany(UserData, { foreignKey: 'user_id', as: 'userData' });
UserData.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
