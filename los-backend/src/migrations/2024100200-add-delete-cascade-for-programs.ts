import { DataTypes, QueryInterface } from 'sequelize';


export async function up({ context }: { context: QueryInterface }) {
  await context.addColumn('programs', 'los_id', {  
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'loses', key: 'id' },
    onDelete: "CASCADE"
    }),
    await context.changeColumn('programs', 'pitch_id', {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'pitches', key: 'id' },
        onDelete: 'CASCADE', 
    })
}

export async function down({ context }: { context: QueryInterface }) {
    await context.removeColumn('programs', 'los_id')
    await context.changeColumn('programs', 'pitch_id', {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'pitches', key: 'id' },
        onDelete: 'NO ACTION',  
      });
}