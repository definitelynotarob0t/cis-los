import { QueryInterface } from 'sequelize';

export async function up({ context }: { context: QueryInterface }) {
  await context.sequelize.query(`
    ALTER TABLE programs
    DROP CONSTRAINT IF EXISTS programs_user_id_fkey,
    ADD CONSTRAINT programs_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE CASCADE;
  `);
}

export async function down({ context }: { context: QueryInterface }) {
  await context.sequelize.query(`
    ALTER TABLE programs
    DROP CONSTRAINT IF EXISTS programs_user_id_fkey,
    ADD CONSTRAINT programs_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE NO ACTION;
  `);
}
