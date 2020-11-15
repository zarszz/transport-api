require('dotenv').config({path: __dirname + '/../.env'})

export default {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  NODE_PORT: process.env.NODE_PORT,
  SECRET: process.env.SECRET,
  DB_DIALECT: process.env.DB_DIALECT,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_PORT: process.env.REDIS_PORT
}