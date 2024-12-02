"use strict";

const { School, User } = require("../models");

const data = {
  albertoadent: {
    name: "Tonchu",
    joinCode: "TONCHU",
  },
  girlinyellow: {
    name: "Literature",
    joinCode: "READABOOK",
  },
  johnsmith: {
    name: "Regular School",
    joinCode: "LEARN",
  },
};

const codes = Object.values(data).map(({ joinCode }) => joinCode);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const genSchool = (key) => {
      return User.createSchoolByUsername(key, data[key]);
    };

    await Promise.all(Object.keys(data).map(genSchool));
  },

  async down(queryInterface, Sequelize) {
    await School.destroy({
      where: { joinCode: { [Sequelize.Op.in]: codes } },
    });
  },
};
