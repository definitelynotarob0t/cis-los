import { Model, DataTypes } from "sequelize";
import { sequelize } from "../util/db";

class ProgramModel extends Model {
	id!: number;
	userId!: number;
	pitchId!: number | null;
	losIds!: number[] | null;
}

ProgramModel.init({
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	userId: {
		type: DataTypes.INTEGER,
		allowNull: true,
		references: { model: "users", key: "id" },
	},
	pitchId: {
		type: DataTypes.INTEGER,
		allowNull: true,
		references: { model: "pitches", key: "id" },
		onDelete: "CASCADE", 
	},
	losIds: {
		type: DataTypes.ARRAY(DataTypes.INTEGER),
		allowNull: true,
		onDelete: "CASCADE",  
	}
}, {
	sequelize,
	underscored: true,
	timestamps: true,
	modelName: "Program"
});

export default ProgramModel;
