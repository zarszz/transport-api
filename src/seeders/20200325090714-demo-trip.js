'use strict';

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
    return queryInterface.bulkInsert('trip', [
      {
        'origin': 'ciendog',
        'destination': 'babakan',
        'trip_date': new Date(),
        'fare': 20.0,
        'bus_id': 1
      },
      {
        'origin': 'ciendog',
        'destination': 'majalaya',
        'trip_date': new Date(),
        'fare': 20.0,
        'bus_id': 2
      },
      {
        'origin': 'bojongsoang',
        'destination': 'gede bage',
        'trip_date': new Date(),
        'fare': 20.0,
        'bus_id': 2
      },
      {
        'origin': 'majalaya',
        'destination': 'garut',
        'trip_date': new Date(),
        'fare': 20.0,
        'bus_id': 1
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
