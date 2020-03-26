'use strict';
module.exports = (sequelize, DataTypes) => {
    const users = sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true,
                min: 10,
                max: 100,

            },
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                max: 100,

            }
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                max: 100,
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                max: 100
            }
        },
        is_admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    }, { timestamps: true });
    users.associate = function (models) {
        users.hasMany(models.booking, {
            foreignKey: 'user_id'
        })
    };
    return users;
};