import { DataTypes } from 'sequelize'
import { QueryInterface } from 'sequelize';


export async function up({ context }: { context: QueryInterface }) {
  await context.createTable('users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
      },
    email: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
      },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [60, 60], 
      }
    },
    pitch_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'pitches', key: 'id' }
    }
  })
}
  
export async function down({ context }: { context: QueryInterface }) {
    await context.dropTable('users')
}



