'use strict';
module.exports = (sequelize, DataTypes) => {
    const buses = sequelize.define('buses', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        number_plate: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                max: 100
            }
        },
        manufacturer: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                max: 100,
            }
        },
        model: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                max: 100,
            }
        },
        year: {
            type: DataTypes.STRING,
            allowNull: false
        },
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, { timestamps: true });
    buses.associate = function (models) {
        // associations can be defined here
    };
    return buses;
};