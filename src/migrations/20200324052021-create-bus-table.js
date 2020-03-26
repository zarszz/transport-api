'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.createTable('buses', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement:true
    },
    number_plate: {
        type: Sequelize.DataTypes.STRING,
        unique: true,
        validate: {
            max: 100,
            allowNull:false
        }
    },
    manufacturer: {
        type: Sequelize.DataTypes.STRING,
        validate: {
            max: 100,
            allowNull:false
        }
    },
    model: {
        type: Sequelize.DataTypes.STRING,
        validate: {
            max: 100,
            allowNull:false
        }
    },
    year: {
        type: Sequelize.DataTypes.STRING,
        validate: {
            max: 10,
            allowNull:false
        }
    },
    capacity: {
        type: Sequelize.DataTypes.INTEGER,
        validate: {
            allowNull:false
        }
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },   
   })
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.dropTable('buses');
  }
};
