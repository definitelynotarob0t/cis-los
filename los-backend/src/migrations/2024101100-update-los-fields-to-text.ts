import { DataTypes, QueryInterface } from 'sequelize';


export async function up({ context }: { context: QueryInterface }) {
    await context.changeColumn('loses', 'activities', {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true,
    });
    await context.changeColumn('loses', 'outputs', {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: true,
    });
    await context.changeColumn('loses', 'usages', {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: true,
    });
    await context.changeColumn('loses', 'outcomes', {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: true,
    });
}

export async function down({ context }: { context: QueryInterface }) {
    await context.changeColumn('loses', 'activities', {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    });
    await context.changeColumn('loses', 'outputs', {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    });
    await context.changeColumn('loses', 'usages', {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    });
    await context.changeColumn('loses', 'outcomes', {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    });
}
