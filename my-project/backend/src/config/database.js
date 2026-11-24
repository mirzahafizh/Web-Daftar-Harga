
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 3306),
        dialect: 'mysql',

        logging: false,

        define: {
            timestamps: true,
            underscored: true,
        },

        // Pool lebih ringan untuk Vercel Serverless
        pool: {
            max: 2,
            min: 0,
            acquire: 30000,
            idle: 10000,
            evict: 1000,
        },

        // Batas waktu koneksi MySQL
        dialectOptions: {
            connectTimeout: 20000,
        },

        retry: {
            max: 2,
        },
    }
);

module.exports = sequelize;
