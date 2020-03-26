'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('booking', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      trip_date: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false
      },
      seat_number: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
      },
      first_name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        validate: {
          max: 100
        }
      },
      last_name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        validate: {
          max: 100
        }
      },
      email: {
        type: Sequelize.DataTypes.STRING,
        validate: {
          isEmail: true,
          max: 100
        }
      },
      trip_id: {
        type: Sequelize.DataTypes.INTEGER,
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
        type: Sequelize.DataTypes.INTEGER,
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
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'users',
            schema: 'public'
          },
          key: 'id'
        },
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
    })
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.dropTable('booking');
  }
};
