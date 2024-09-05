import { DataTypes } from 'sequelize'
import { QueryInterface } from 'sequelize';



export async function up({ context }: { context: QueryInterface }) {
  await context.createTable('pitches', {
      id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
      title: {
          type: DataTypes.TEXT,
          allowNull: true
        },
      main_activity: {
          type: DataTypes.TEXT,
          allowNull: true
        },
      challenge: {
          type: DataTypes.TEXT,
          allowNull: true
        },
      outcome: {
          type: DataTypes.TEXT,
          allowNull: true
        },
  })
}
  
export async function down({ context }: { context: QueryInterface }) {
    await context.dropTable('pitches')
}



