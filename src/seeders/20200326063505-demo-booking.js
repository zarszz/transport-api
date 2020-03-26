'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.bulkInsert('booking', [
     {
     "trip_id": 1,
     "user_id": 2,
     "bus_id": 1,
     "trip_date": new Date(),
     "first_name": "ichi",
     "seat_number": 10,
     "last_name": "igika",
     "email": "ichikawaii@email.com"
    },
    {
      "trip_id": 2,
      "user_id": 1,
      "bus_id": 2,
      "seat_number": 12,
      "trip_date": new Date(),
      "first_name": "udin",
      "last_name": "hakaya",
      "email": "uhaka@email.com"
     },
     {
      "trip_id": 1,
      "user_id": 1,
      "bus_id": 2,
      "seat_number": 1,
      "trip_date": new Date(),
      "first_name": "ucok",
      "last_name": "hayasama",
      "email": "hasayamau@email.com"
     },         
   ])
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.bulkDelete('booking', null, {})
  }
};
