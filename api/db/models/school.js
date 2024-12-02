"use strict";
const e = require("express");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class School extends Model {
    static async findByJoinCode(joinCode) {
      return School.findOne({ where: { joinCode } });
    }

    static async addUserByPk(pk, userId, role = "STUDENT") {
      const school = School.findByPk(pk);
      if (!school) {
        throw new Error("Could not find School");
      }
      return school.addUser(userId, role);
    }

    async addUser(userId, role = "STUDENT") {
      let user = { id: userId };
      if (typeof userId == "string") {
        user = await sequelize.models.User.findByUsername(userId);
      }
      return this.createSchoolUser({ userId: user.id, role });
    }

    async addStudent(userId) {
      return this.addUser(userId);
    }

    async addTeacher(userId) {
      return this.addUser(userId, "TEACHER");
    }

    async addStudents(userIdArray) {
      const data = [];
      for (const UID of userIdArray) {
        data.push(await this.addStudent(UID));
      }
      return data;
    }
    async addTeachers(userIdArray) {
      const data = [];
      for (const UID of userIdArray) {
        data.push(await this.addTeacher(UID));
      }
      return data;
    }

    async addClass(classAttributes, options = {}) {
      return this.createClass(classAttributes, options);
    }

    async addClasses(classes, options = {}) {
      const data = [];
      for (const cls of classes) {
        data.push(await this.createClass(cls, options));
      }
      return data;
    }

    async getStudents(options = {}) {
      const students = await this.getSchoolUsers({
        where: {
          role: "STUDENT",
        },
        ...options,
      });
      return students;
    }

    async getTeachers(options = {}) {
      const students = await this.getSchoolUsers({
        where: {
          role: "TEACHER",
        },
        ...options,
      });
      return students;
    }

    static associate(models) {
      // define association here
      School.hasMany(models.Class, {
        foreignKey: "schoolId",
        onDelete: "CASCADE",
        hooks: true,
      });
      School.hasMany(models.SchoolUser, {
        foreignKey: "schoolId",
        onDelete: "CASCADE",
        hooks: true,
      });
      School.hasMany(models.Attendance, {
        foreignKey: "schoolId",
        onDelete: "CASCADE",
        hooks: true,
      });

      School.belongsTo(models.User, {
        foreignKey: "ownerId",
      });
    }
  }
  School.init(
    {
      ownerId: {
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "id",
        },
      },
      name: { type: DataTypes.STRING, allowNull: false },
      phoneNumber: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false },
      joinCode: { type: DataTypes.STRING, allowNull: false, unique: true },
    },
    {
      sequelize,
      modelName: "School",
      hooks: {
        async beforeValidate(school, options) {
          const { email, phoneNumber } = school.toJSON();

          if (!(email && phoneNumber)) {
            const user = await sequelize.models.User.findByPk(
              school.toJSON().ownerId
            );
            if (!email) {
              school.setDataValue("email", user.toJSON().email);
            }
            if (!phoneNumber) {
              school.setDataValue(
                "phoneNumber",
                user.toJSON().phoneNumber || "PHONE NUMBER NEEDED"
              );
            }
          }
        },
      },
    }
  );
  return School;
};
