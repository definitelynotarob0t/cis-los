import { Dialect } from "sequelize";  // Import the Dialect type
require("dotenv").config();



export const database = process.env.DB_NAME || "default_db_name";  // Default for correct typing
export const username = process.env.DB_USER || "default_username";  
export const password = process.env.DB_PASSWORD || "default_password"; 
export const host = process.env.DB_HOST || "default_db_host";
export const port = process.env.DB_PORT || 5432;  // This is the database port
export const PORT = process.env.PORT || 3000;  // This is the application port
export const SECRET = process.env.SECRET;


if (!database || !username || !password ) {
	throw new Error("Missing database credentials: Ensure that DB_NAME, DB_USER, and DB_PASSWORD are defined in your .env file.");
}

export const config = {
	database, 
	username,  
	password, 
	host,
	port: 5432,  // Default PostgreSQL port
	dialect: "postgres" as Dialect,
	dialectOptions: {
		ssl: {
			require: true,  // Enable SSL
			rejectUnauthorized: false  // Disable strict certificate checking
		}
	},
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	},
};


