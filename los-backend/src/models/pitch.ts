import { Model, DataTypes } from 'sequelize'

import { sequelize } from '../util/db'

class PitchModel extends Model {
  id!: number;
  title!: string | null;
  mainActivity!: string | null;
  challenge!: string | null;
  outcome!: string | null;
  userId!: number;
}


PitchModel.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  mainActivity: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  challenge: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  outcome: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' }
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'Pitch',
})

export default PitchModel

