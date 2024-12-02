"use strict";

const { School, SchoolUser } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const toncu = await School.findByJoinCode("TONCHU");
    const school1 = await School.findByJoinCode("LEARN");
    const school2 = await School.findByJoinCode("READABOOK");
    const studentIdArray = [1, 2, 3].map((s) => `teacher${s}`);
    await toncu.addTeachers(studentIdArray);
    await school1.addTeachers(studentIdArray);
    await school2.addTeachers(studentIdArray);
  },

  async down(queryInterface, Sequelize) {
    const tonchu = await School.findByJoinCode("TONCHU");
    const school1 = await School.findByJoinCode("LEARN");
    const school2 = await School.findByJoinCode("READABOOK");
    const schoolIds = [tonchu.id, school1.id, school2.id];
    await SchoolUser.delete({ schoolId: { [Sequelize.Op.in]: schoolIds } });
  },
};
