'use strict';

module.exports = (sequelize, DataTypes) => {
    const Trip = sequelize.define('trip', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            notNull: false
        },
        origin: {
            type: DataTypes.STRING,
            notNull: false
        },
        destination: {
            type: DataTypes.STRING,
            notNull: false
        },
        trip_date: {
            type: DataTypes.DATE,
            notNull: false
        },
        fare: {
            type: DataTypes.FLOAT,
            notNull: false
        },
        status: {
            type: DataTypes.FLOAT,
            defaultValue: 1.0,
            notNull: false
        }       
        }, { timestamps: true });
    Trip.associate = function(models) {
        Trip.hasOne(models.buses, {
            foreignKey: 'id',
        })
    }
    return Trip;
};