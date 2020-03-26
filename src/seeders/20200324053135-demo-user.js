'use strict';

const { hashPassword } = require('../helpers/validations')

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
   return queryInterface.bulkInsert('users', [
     {
       'email': 'ucok@email.com',
       'first_name': 'ucok',
       'last_name': 'ganteng',
       'password': hashPassword('password'),
       'is_admin': true
     },
     {
      'email': 'abdu;@email.com',
      'first_name': 'abdul',
      'last_name': 'solihin',
      'password': hashPassword('password'),
      'is_admin': false
    },
    {
      'email': 'mamat@email.com',
      'first_name': 'mamat',
      'last_name': 'McLaunrence',
      'password': hashPassword('password'),
      'is_admin': false
    }         
    ])
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('users', null, {});
  }
};
