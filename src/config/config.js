import env from '../env';

export default {
    'development': {
        database: env.DB_NAME,
        username: env.DB_USER,
        password: env.DB_PASSWORD,
        host: env.DB_HOST,
        dialect: env.DB_DIALECT,
        port: env.DB_PORT,
        define: {
            timestamps: true,
            freezeTableName: true
        }
    }
}