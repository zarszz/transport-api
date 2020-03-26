'use strict';
module.exports = (sequelize, DataTypes) => {
  const TestModel = sequelize.define('TestModel', {
    testAttribute1: DataTypes.STRING,
    testAttribute2: DataTypes.STRING
  }, {});
  TestModel.associate = function(models) {
    // associations can be defined here
  };
  return TestModel;
};