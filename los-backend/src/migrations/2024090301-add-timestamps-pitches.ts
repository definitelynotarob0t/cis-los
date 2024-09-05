const { DataTypes, Sequelize } = require('sequelize');
import { QueryInterface } from 'sequelize';


export async function up({ context }: { context: QueryInterface }) {
    await context.addColumn('pitches', 'created_at', {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
    await context.addColumn('pitches', 'updated_at', {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
}


export async function down({ context }: { context: QueryInterface }) {
    await context.removeColumn('pitches', 'created_at');
    await context.removeColumn('pitches', 'updated_at');
};
