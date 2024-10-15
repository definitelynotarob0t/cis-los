import { DataTypes, QueryInterface } from "sequelize";

export async function up({ context }: { context: QueryInterface }) {
	await context.addColumn("users", "pitch_ids", {
		type: DataTypes.INTEGER,
		allowNull: true,
		references: { model: "pitches", key: "id" },
		onDelete: "CASCADE"
	});
	await context.addColumn("users", "los_ids", {
		type: DataTypes.ARRAY(DataTypes.INTEGER),
		allowNull: true,
		onDelete: "CASCADE"
	});
}

export async function down({ context }: { context: QueryInterface }) {
	await context.removeColumn("users", "pitch_ids");
	await context.removeColumn("users", "los_ids");
}
      