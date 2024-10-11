import { Model, DataTypes } from 'sequelize'

import { sequelize } from '../util/db'

class LosModel extends Model {
  id!: number;
  activities!: string[] | null;
  outputs!: string[] | null;
  usages!: string[] | null;
  outcomes!: string[] | null;
  userId!: number;
  programId!: number | null;
}


LosModel.init({
  id: { 
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
},
  activities: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: true
  },
  outputs: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: true
  },
  usages: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: true
  },
  outcomes: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' }
  },
  programId: { 
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'programs', key: 'id' },
    onDelete: 'CASCADE'
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'Los',
  tableName: 'loses'
})

export default LosModel

