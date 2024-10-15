import { Dialect } from "sequelize";  // Import the Dialect type
require("dotenv").config();



export const database = process.env.DB_NAME || "default_db_name";  // Default for correct typing
export const username = process.env.DB_USER || "default_username";  
export const password = process.env.DB_PASSWORD || "default_password"; 
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
	host: "localhost",  // Because using SSH tunnel
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



// // Config before tunnelling

// export const DATABASE_URL = process.env.DATABASE_URL;
// export const PORT = process.env.PORT || 3000;
// export const SECRET = process.env.SECRET;

// export const config = {
//   DATABASE_URL,
//   PORT,
//   SECRET,
//   development: {
//     url: DATABASE_URL,
//     dialect: 'postgres',
//   },
//   test: {
//     url: DATABASE_URL,
//     dialect: 'postgres',
//   },
//   production: {
//     url: DATABASE_URL,
//     dialect: 'postgres',
//   },
// };
