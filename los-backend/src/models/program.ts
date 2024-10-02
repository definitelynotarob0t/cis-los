import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../util/db';

class ProgramModel extends Model {
  id!: number;
  userId!: number;
  pitchId!: number;
  losId!: number;
}

ProgramModel.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' },
  },
  pitchId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'pitches', key: 'id' },
    onDelete: 'CASCADE', 
  },
  losId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { 
      model: 'los', 
      key: 'id' 
    },
    onDelete: 'CASCADE',  
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'Program'
});

export default ProgramModel;
