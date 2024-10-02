import { DataTypes, QueryInterface } from 'sequelize';


export async function up({ context }: { context: QueryInterface }) {
  await context.addColumn('users', 'programs_ids', {  
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: true,
    onDelete: "CASCADE"
    })
}

export async function down({ context }: { context: QueryInterface }) {
    await context.removeColumn('users', 'program_ids')
}

