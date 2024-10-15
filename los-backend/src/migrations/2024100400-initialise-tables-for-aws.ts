import { DataTypes, QueryInterface, Sequelize } from "sequelize";

export async function up({ context }: { context: QueryInterface }) {
	// 1. Create 'users' table
	await context.createTable("users", {
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
		program_ids: {
			type: DataTypes.ARRAY(DataTypes.INTEGER),
			allowNull: true
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
		},
		updated_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
		},
		reset_token: {
			type: DataTypes.STRING,
			allowNull: true
		}, 
		reset_token_expiry: {
			type: DataTypes.DATE,
			allowNull: true
		}
	});

	// 2. Create 'programs' table (without 'pitch_id' and 'los_ids' to avoid circular dependency)
	await context.createTable("programs", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: { model: "users", key: "id" },
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
		},
		updated_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
		}
	});

	// 3. Create 'pitches' table, now safe to reference 'programs'
	await context.createTable("pitches", {
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
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: { model: "users", key: "id" },
			onDelete: "CASCADE"
		},
		program_id: { 
			type: DataTypes.INTEGER,
			allowNull: true,
			references: { model: "programs", key: "id" },
			onDelete: "CASCADE"
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
		},
		updated_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
		}
	});

	// 4. Create 'loses' table
	await context.createTable("loses", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		inputs: {
			type: DataTypes.ARRAY(DataTypes.STRING),        
			allowNull: true
		},
		activities: {
			type: DataTypes.ARRAY(DataTypes.STRING),        
			allowNull: true
		},
		outputs: {
			type: DataTypes.ARRAY(DataTypes.STRING),        
			allowNull: true
		},
		usages: {
			type: DataTypes.ARRAY(DataTypes.STRING),        
			allowNull: true
		},
		outcomes: {
			type: DataTypes.ARRAY(DataTypes.STRING),        
			allowNull: true
		},
		program_id: { 
			type: DataTypes.INTEGER,
			allowNull: true,
			references: { model: "programs", key: "id" },
			onDelete: "CASCADE"
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: { model: "users", key: "id" },
			onDelete: "CASCADE"
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
		},
		updated_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
		}
	});

	// 5. Create 'sessions' table
	await context.createTable("sessions", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: "users",  key: "id" },
			onDelete: "CASCADE"
		},
		token: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
		},
		updated_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
		}
	});

	await context.addColumn("programs", "pitch_id", {
		type: DataTypes.INTEGER,
		allowNull: true,
		references: { model: "pitches", key: "id" },
		onDelete: "CASCADE"
	});
	await context.addColumn("programs", "los_ids", {
		type: DataTypes.ARRAY(DataTypes.INTEGER),
		allowNull: true,
		onDelete: "CASCADE"
	});
}

export async function down({ context }: { context: QueryInterface }) {
	await context.dropTable("sessions");
	await context.dropTable("loses");
	await context.dropTable("pitches");
	await context.dropTable("programs");
	await context.dropTable("users");
}
