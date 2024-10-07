import { DataTypes, QueryInterface } from 'sequelize';

export async function up({ context }: { context: QueryInterface }) {
    await context.removeColumn('loses', 'inputs')
}

export async function down({ context }: { context: QueryInterface }) {
    await context.addColumn('loses', 'inputs', {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
    });
}
      