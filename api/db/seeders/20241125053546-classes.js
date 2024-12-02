"use strict";
const { School, Class } = require("../models");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tonchu = await School.findByJoinCode("TONCHU");
    await tonchu.addClasses([
      { name: "Tigers", level: "Basic" },
      { name: "Discovery", level: "Novice" },
      { name: "Black Uniform", level: "Intermediate" },
      { name: "Blue Uniform", level: "Advanced" },
      { name: "JyoKyoNim 1", level: "Expert" },
      { name: "JyoKyoNim 2", level: "JyoKyoNim" },
    ]);

    const lit = await School.findByJoinCode("READABOOK");
    await lit.addClasses([
      { name: "Book Club" },
      { name: "Hunting Club" },
      { name: "Cannibalism Club" },
    ]);

    const learn = await School.findByJoinCode("LEARN");
    await learn.addClasses([
      { name: "Math" },
      { name: "English" },
      { name: "Geography" },
      { name: "History" },
      { name: "Science" },
    ]);
  },

  async down(queryInterface, Sequelize) {
    const tonchu = await School.findByJoinCode("TONCHU");
    const lit = await School.findByJoinCode("READABOOK");
    const learn = await School.findByJoinCode("LEARN");

    const classes = [
      ...(await lit.getClasses()),
      ...(await tonchu.getClasses()),
      ...(await learn.getClasses()),
    ];

    await Promise.all(classes.map((e) => e.destroy()));
  },
};
