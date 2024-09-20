import { DataTypes, QueryInterface } from 'sequelize';


export async function up({ context }: { context: QueryInterface }) {
  await context.addColumn('users', 'reset_token', {  
    type: DataTypes.STRING,
    allowNull: true,
    onDelete: "CASCADE"
    }),
    await context.addColumn('users', 'reset_token_expiry', {  
        type: DataTypes.DATE,
        allowNull: true,
        onDelete: "CASCADE"
    })
}

export async function down({ context }: { context: QueryInterface }) {
    await context.removeColumn('users', 'reset_token')
    await context.removeColumn('users', 'reset_token_expiry')
}

