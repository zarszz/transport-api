'use strict';

module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define('booking', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        trip_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        seat_number: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                max: 100
            }
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                max: 100
            }
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true,
                max: 100
            }
        },
        trip_id: {
            type: DataTypes.INTEGER,
            references: {
                model: {
                    tableName: 'trip',
                    schema: 'public'
                },
                key: 'id'
            },
            allowNull: false            
        },
        bus_id: {
            type: DataTypes.INTEGER,
            references: {
                model: {
                    tableName: 'buses',
                    schema: 'public'
                },
                key: 'id'
            },
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: {
                    tableName: 'users',
                    schema: 'public'
                },
                key: 'id'
            },
            allowNull: false            
        }
    }, { timestamps: true });
    Booking.associate = function (models) {
        Booking.hasOne(models.buses, {
            foreignKey: 'id',
            as: 'bus'
        }),
        Booking.hasOne(models.trip, {
            foreignKey: 'id',
            as: 'trip'
        }),
        Booking.belongsTo(models.users, {
            foreignKey: 'id',
        })        
    }
    return Booking;
};