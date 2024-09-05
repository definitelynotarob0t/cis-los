import { QueryInterface, DataTypes } from 'sequelize';

export async function up({ context }: { context: QueryInterface }) {
  await context.addColumn('users', 'disabled', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  });
}

export async function down({ context }: { context: QueryInterface }) {
  await context.removeColumn('users', 'disabled');
}
