"use strict";

const options = {
  schema:
    process.env.NODE_ENV === "production" ? process.env.SCHEMA : undefined,
};

const tableName = "ClassTimes";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "ClassTimes",
      "endTime",
      Sequelize.DataTypes.TIME,
      {
        allowNull: true,
        defaultValue: null,
      },
      options
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(tableName, "endTime", options);
  },
};
