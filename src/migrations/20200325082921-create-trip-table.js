'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.createTable('trip', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        validate: {
            notNull: false
        }
    },
    origin: {
        type: Sequelize.DataTypes.STRING,
        validate: {
            notNull: false,
            max: 100
        }
    },
    destination: {
        type: Sequelize.DataTypes.STRING,
        validate: {
            notNull: false,
            max:100
        }
    },
    trip_date: {
        type: Sequelize.DataTypes.DATE,
        validate:{
            notNull: false
        }
    },
    fare: {
        type: Sequelize.DataTypes.FLOAT,
        validate:{
            notNull: false
        }
    },
    status: {
        type: Sequelize.DataTypes.FLOAT,
        defaultValue: 1.0,
        validate: {
            notNull: false
        }
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
   return queryInterface.dropTable('trip');
  }
};
