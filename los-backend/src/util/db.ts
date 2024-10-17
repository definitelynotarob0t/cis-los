import { Sequelize } from "sequelize";
import { config } from "./config";
import { Umzug, SequelizeStorage } from "umzug";

const sequelize = new Sequelize(config.database, config.username, config.password, {
	host: config.host,
	port: config.port,
	dialect: config.dialect,
	dialectOptions: config.dialectOptions,
	pool: config.pool
});


const connectToDatabase = async () => {
	try {
		await sequelize.authenticate();
		await runMigrations();
		console.log("Connected to the database");
	} catch (err) {
		console.error("Database connection error:", err);
		return process.exit(1);
	}

	return null;
};



const migrationConf = {
	migrations: {
		glob: "src/migrations/*.ts",
	},
	storage: new SequelizeStorage({ sequelize, tableName: "migrations" }),
	context: sequelize.getQueryInterface(),
	logger: console,
};
  
const runMigrations = async () => {
	const migrator = new Umzug(migrationConf);
	const migrations = await migrator.up();
	console.log("Migrations up to date", {
		files: migrations.map((mig) => mig.name),
	});
};
const rollbackMigration = async () => {
	await sequelize.authenticate();
	const migrator = new Umzug(migrationConf);
	await migrator.down();
};

export { 
	connectToDatabase, 
	sequelize, 
	rollbackMigration };

