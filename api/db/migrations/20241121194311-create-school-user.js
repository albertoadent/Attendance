"use strict";

const options = {
  schema:
    process.env.NODE_ENV === "production" ? process.env.SCHEMA : undefined,
};

const tableName = "SchoolUsers";

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
        role: {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: "STUDENT",
        },
        schoolId: {
          type: Sequelize.INTEGER,
          references: {
            model: "Schools",
          },
        },
        userId: {
          type: Sequelize.INTEGER,
          references: {
            model: "Users",
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
