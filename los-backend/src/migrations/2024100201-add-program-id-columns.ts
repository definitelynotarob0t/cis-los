import { DataTypes, QueryInterface } from 'sequelize';


export async function up({ context }: { context: QueryInterface }) {
  await context.addColumn('pitches', 'program_id', {  
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'programs', key: 'id' },
    onDelete: "CASCADE"
    }),
    await context.addColumn('loses', 'program_id', {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'programs', key: 'id'},
        onDelete: "CASCADE"
    })
}

export async function down({ context }: { context: QueryInterface }) {
    await context.removeColumn('pithces', 'program_id')
    await context.removeColumn('loses', 'program_id')
}