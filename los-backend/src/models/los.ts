import { Model, DataTypes } from 'sequelize'

import { sequelize } from '../util/db'

class LosModel extends Model {
  id!: number;
  inputs!: string[] | null;
  activities!: string[] | null;
  outputs!: string[] | null;
  usages!: string[] | null;
  outcomes!: string[] | null;
  userId!: number;
}


LosModel.init({
  id: { // los id is pitch id
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: { model: 'pitches', key: 'id'}
  },
  inputs: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  },
  activities: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  },
  outputs: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  },
  usages: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  },
  outcomes: {
    type: DataTypes.ARRAY(DataTypes.STRING),
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
  modelName: 'Los',
  tableName: 'loses'
})

export default LosModel
