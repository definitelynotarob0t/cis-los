import { DataTypes, QueryInterface } from 'sequelize';


export async function up({ context }: { context: QueryInterface }) {
  await context.addColumn('users', 'pitch_id', {  
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'pitches', key: 'id' },
    onDelete: "CASCADE"
    })
}

export async function down({ context }: { context: QueryInterface }) {
    await context.removeColumn('users', 'pitch_id')
}