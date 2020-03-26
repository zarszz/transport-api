'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        validate: {
          notNull: true
        }
      },
      email: {
        type: Sequelize.DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: true,
          min: 10,
          max: 100,
          notNull: true
        },
      },
      first_name: {
        type: Sequelize.DataTypes.STRING,
        validate: {
          max: 100,
          notNull: true
        }
      },
      last_name: {
        type: Sequelize.DataTypes.STRING,
        validate: {
          max: 100,
          notNull: true
        }
      },
      password: {
        type: Sequelize.DataTypes.STRING,
        validate: {
          max: 100,
          notNull: true
        }
      },
      is_admin: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },           
    },)
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
   return queryInterface.dropTable('users');   
  }
};
