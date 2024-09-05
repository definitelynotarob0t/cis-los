import { DataTypes } from 'sequelize'
import { QueryInterface } from 'sequelize';


export async function up({ context }: { context: QueryInterface }) {
    await context.createTable('sessions', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users',  key: 'id' },
        onDelete: 'CASCADE'
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    })
}
  
export async function down({ context }: { context: QueryInterface }) {
    await context.dropTable('sessions')
}



