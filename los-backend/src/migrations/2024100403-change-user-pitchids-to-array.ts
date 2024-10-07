import { DataTypes, QueryInterface } from 'sequelize';

export async function up({ context }: { context: QueryInterface }) {
  // Step 1: Create a temporary column with the new type (INTEGER array)
  await context.addColumn('users', 'pitch_ids_temp', {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: true,  // Adjust this based on your requirements
  });

  // Step 2: Migrate data from 'pitch_ids' to 'pitch_ids_temp'
  // Convert existing integer values to single-element arrays
  await context.sequelize.query(`
    UPDATE users
    SET pitch_ids_temp = ARRAY[pitch_ids]
    WHERE pitch_ids IS NOT NULL;
  `);

  // Step 3: Remove the old 'pitch_ids' column
  await context.removeColumn('users', 'pitch_ids');

  // Step 4: Rename the temporary column to 'pitch_ids'
  await context.renameColumn('users', 'pitch_ids_temp', 'pitch_ids');
}

export async function down({ context }: { context: QueryInterface }) {
  // Reverse the process: Convert back to INTEGER type

  // Step 1: Add a temporary column with the original type (INTEGER)
  await context.addColumn('users', 'pitch_ids_temp', {
    type: DataTypes.INTEGER,
    allowNull: true,  // Adjust this based on your requirements
  });

  // Step 2: Migrate data back to the old type, extracting the first element from the array
  await context.sequelize.query(`
    UPDATE users
    SET pitch_ids_temp = pitch_ids[1]
    WHERE pitch_ids IS NOT NULL;
  `);

  // Step 3: Remove the 'pitch_ids' array column
  await context.removeColumn('users', 'pitch_ids');

  // Step 4: Rename the temporary column back to 'pitch_ids'
  await context.renameColumn('users', 'pitch_ids_temp', 'pitch_ids');
}
