import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../util/db'

class UserModel extends Model {
    id!: number;
    email!: string;
    name!: string;
    passwordHash!: string;
    pitchId!: number | null; 
    disabled!: boolean;
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
  pitchId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'pitches', key: 'id' }
  }
}, {
  sequelize,
  defaultScope: {
    where: {
      disabled: false
    },
  },
  underscored: true,
  timestamps: true,
  modelName: 'User'
})

export default UserModel

