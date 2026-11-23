
'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class DiscountCode extends Model {
        static associate(models) {
            // Relasi dapat ditambahkan jika diperlukan.
        }
    }

    DiscountCode.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            code: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true,
            },

            percentage: {
                type: DataTypes.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0,
            },
        },
        {
            sequelize,
            modelName: 'DiscountCode',
            tableName: 'discount_codes',
            timestamps: true,
            underscored: true,
        }
    );

    return DiscountCode;
};
