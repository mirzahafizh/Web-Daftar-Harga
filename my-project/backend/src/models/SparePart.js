
'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SparePart extends Model {
    static associate(models) {
      // Relasi model dapat ditambahkan di sini nantinya.
    }
  }

  SparePart.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      part_number: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: 'Part number wajib diisi.',
          },
        },
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Deskripsi suku cadang wajib diisi.',
          },
        },
      },

      retail_price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: 'Harga tidak boleh negatif.',
          },
        },
      },

      disc_code: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'SparePart',
      tableName: 'spare_parts',
      timestamps: true,
      underscored: true,
    }
  );

  return SparePart;
};
