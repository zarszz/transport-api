require('dotenv').config()

export default {
  DB_HOST: process.env.DB_HOST,  
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  NODE_PORT: process.env.NODE_PORT,
  SECRET: process.env.SECRET
}