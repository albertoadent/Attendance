"use strict";

const { User } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const userData = [
      {
        firstName: "Alberto",
        lastName: "Dent",
        email: "albertoadent@gmail.com",
        username: "albertoadent",
        password: "password",
        phoneNumber: "4042685922",
      },
      {
        firstName: "John",
        lastName: "Smith",
        email: "johnsmith@gmail.com",
        username: "johnsmith",
        password: "password",
        phoneNumber: "1231111212",
      },
      {
        firstName: "Elena",
        lastName: "Dougherty",
        email: "girlinyellow@gmail.com",
        username: "girlinyellow",
        password: "password",
        phoneNumber: "1231111212",
      },
      {
        firstName: "Charles",
        lastName: "Dougherty",
        email: "hunter27@gmail.com",
        username: "hunter27",
        password: "password",
        phoneNumber: "1231111212",
      },
      {
        firstName: "Jack",
        lastName: "Black",
        email: "jack_black@gmail.com",
        username: "kingofrockandroll",
        password: "password",
        phoneNumber: "1231111212",
      },
      {
        firstName: "Student",
        lastName: "1",
        email: "student1@gmail.com",
        username: "student1",
        password: "password",
        phoneNumber: "1231111212",
      },
      {
        firstName: "Student",
        lastName: "2",
        email: "student2@gmail.com",
        username: "student2",
        password: "password",
        phoneNumber: "1231111212",
      },
      {
        firstName: "Student",
        lastName: "3",
        email: "student3@gmail.com",
        username: "student3",
        password: "password",
        phoneNumber: "1231111212",
      },
      {
        firstName: "Student",
        lastName: "4",
        email: "student4@gmail.com",
        username: "student4",
        password: "password",
        phoneNumber: "1231111212",
      },
      {
        firstName: "Student",
        lastName: "5",
        email: "student5@gmail.com",
        username: "student5",
        password: "password",
        phoneNumber: "1231111212",
      },
      {
        firstName: "Student",
        lastName: "6",
        email: "student6@gmail.com",
        username: "student6",
        password: "password",
        phoneNumber: "1231111212",
      },
      {
        firstName: "Student",
        lastName: "7",
        email: "student7@gmail.com",
        username: "student7",
        password: "password",
        phoneNumber: "1231111212",
      },
      {
        firstName: "Student",
        lastName: "8",
        email: "student8@gmail.com",
        username: "student8",
        password: "password",
        phoneNumber: "1231111212",
      },
      {
        firstName: "Student",
        lastName: "9",
        email: "student9@gmail.com",
        username: "student9",
        password: "password",
        phoneNumber: "1231111212",
      },
      {
        firstName: "Student",
        lastName: "10",
        email: "student10@gmail.com",
        username: "student10",
        password: "password",
        phoneNumber: "1231111212",
      },
      {
        firstName: "Teacher",
        lastName: "1",
        email: "teacher1@gmail.com",
        username: "teacher1",
        password: "password",
        phoneNumber: "1231111212",
      },
      {
        firstName: "Teacher",
        lastName: "2",
        email: "teacher2@gmail.com",
        username: "teacher2",
        password: "password",
        phoneNumber: "1231111212",
      },
      {
        firstName: "Teacher",
        lastName: "3",
        email: "teacher3@gmail.com",
        username: "teacher3",
        password: "password",
        phoneNumber: "1231111212",
      },
      {
        firstName: "Teacher",
        lastName: "4",
        email: "teacher4@gmail.com",
        username: "teacher4",
        password: "password",
        phoneNumber: "1231111212",
      },
      {
        firstName: "Teacher",
        lastName: "5",
        email: "teacher5@gmail.com",
        username: "teacher5",
        password: "password",
        phoneNumber: "1231111212",
      },
    ];

    for (const user of userData) {
      await User.create(user);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", {
      username: {
        [Sequelize.Op.in]: [
          "albertoadent",
          "johnsmith",
          "girlinyellow",
          "hunter27",
          "kingofrockandroll",
          "student1",
          "student2",
          "student3",
          "student4",
          "student5",
          "student6",
          "student7",
          "student8",
          "student9",
          "student10",
          "teacher1",
          "teacher2",
          "teacher3",
          "teacher4",
          "teacher5",
        ],
      },
    });
  },
};
