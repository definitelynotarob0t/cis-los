import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../util/db'

class UserModel extends Model {
    id!: number;
    email!: string;
    name!: string;
    passwordHash!: string;
    programIds!: number[] | null; 
    pitchIds!: number[] | null;
    losIds!: number[] | null;
}


UserModel.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [60, 60], 
    }
  },
  resetToken: {
    type: DataTypes.STRING,
    allowNull: true
  }, 
  resetTokenExpiry: {
    type: DataTypes.DATE,
    allowNull: true
  },
  programIds: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: true,
  },
  pitchIds: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: true,
  },
  losIds: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: true,
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'User'
})

export default UserModel

