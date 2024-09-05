import { DataTypes } from 'sequelize';
import { QueryInterface } from 'sequelize';


export async function up({ context }: { context: QueryInterface }) {
    await context.addColumn('pitches', 'user_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' }
    });
}


export async function down({ context }: { context: QueryInterface }) {
    await context.removeColumn('pitches', 'user_id');
};
