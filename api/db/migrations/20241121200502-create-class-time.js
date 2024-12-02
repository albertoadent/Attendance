"use strict";

const options = {
  schema:
    process.env.NODE_ENV === "production" ? process.env.SCHEMA : undefined,
};

const tableName = "ClassTimes";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      tableName,
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        mon: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        tue: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        wed: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        thu: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        fri: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        sat: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        sun: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        time: {
          type: Sequelize.TIME,
        },
        classId: {
          type: Sequelize.INTEGER,
          references: {
            model: "Classes",
            key: "id",
          },
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      options
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable({ ...options, tableName });
  },
};
