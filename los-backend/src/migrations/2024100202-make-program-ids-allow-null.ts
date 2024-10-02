import { DataTypes, QueryInterface } from 'sequelize';


export async function up({ context }: { context: QueryInterface }) {
  await context.changeColumn('pitches', 'program_id', {  
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'programs', key: 'id' },
    onDelete: "CASCADE"
    }),
    await context.changeColumn('loses', 'program_id', {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'programs', key: 'id'},
        onDelete: "CASCADE"
    })
}

export async function down({ context }: { context: QueryInterface }) {
    await context.changeColumn('pithces', 'program_id', {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'programs', key: 'id' },
        onDelete: "CASCADE"
    })
    await context.changeColumn('loses', 'program_id', {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'programs', key: 'id'},
        onDelete: "CASCADE"
    })
}