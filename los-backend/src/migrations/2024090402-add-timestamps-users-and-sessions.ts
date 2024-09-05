import { DataTypes, Sequelize } from 'sequelize';
import { QueryInterface } from 'sequelize';


export async function up({ context }: { context: QueryInterface }) {
    await context.addColumn('users', 'created_at', {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
    await context.addColumn('users', 'updated_at', {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
    await context.addColumn('sessions', 'created_at', {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      });
      await context.addColumn('sessions', 'updated_at', {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      });
}


export async function down({ context }: { context: QueryInterface }) {
    await context.removeColumn('users', 'created_at');
    await context.removeColumn('users', 'updated_at');
    await context.removeColumn('sessions', 'created_at');
    await context.removeColumn('sessions', 'updated_at');
};
