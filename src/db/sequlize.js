import Sequelize from 'sequelize';
import env from '../env';

const sequlizeConnection = new Sequelize({
    dialect: 'postgres',
    host: env.DB_HOST,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    define: {
        freezeTableName: true
    },
});

export default sequlizeConnection;