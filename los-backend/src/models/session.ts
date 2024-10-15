import { Model, DataTypes } from "sequelize";
import { sequelize } from "../util/db";

class Session extends Model {
	id!: number;
	userId!: number;
	token!: string;
}

Session.init({
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	userId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: { model: "users",  key: "id" },
		onDelete: "CASCADE"
	},
	token: {
		type: DataTypes.STRING,
		allowNull: false,
	},
}, {
	sequelize,
	underscored: true,
	timestamps: true,
	modelName: "Session"
});

export default Session;
