const mysql2 = require('mysql2');

require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 3306),
        dialect: 'mysql',

        // Memuat driver MySQL secara eksplisit
        dialectModule: mysql2,

        logging: false,

        define: {
            timestamps: true,
            underscored: true,
        },

        pool: {
            max: 2,
            min: 0,
            acquire: 30000,
            idle: 10000,
            evict: 1000,
        },

        dialectOptions: {
            connectTimeout: 20000,
        },

        retry: {
            max: 2,
        },
    }
);

module.exports = sequelize;
