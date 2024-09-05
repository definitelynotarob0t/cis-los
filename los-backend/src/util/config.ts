require('dotenv').config()

export const DATABASE_URL = process.env.DATABASE_URL;
export const PORT = process.env.PORT || 3000;
export const SECRET = process.env.SECRET;

export const config = {
  DATABASE_URL,
  PORT,
  SECRET,
  development: {
    url: DATABASE_URL,
    dialect: 'postgres',
  },
  test: {
    url: DATABASE_URL,
    dialect: 'postgres',
  },
  production: {
    url: DATABASE_URL,
    dialect: 'postgres',
  },
};
