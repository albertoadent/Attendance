"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static async findByUsername(username) {
      return User.findOne({ where: { username } });
    }

    static async createSchoolByUsername(
      username,
      attributes = {},
      options = {}
    ) {
      const user = await User.findByUsername(username);
      if (!user) {
        throw new Error("User Not Found");
      }
      return user.createSchool(attributes, options);
    }

    login(password) {
      const storedHash = this.getDataValue("hashedPassword");
      const valid = bcrypt.compareSync(password, storedHash);
      if (valid) {
        return true;
      }
      throw new Error("LOGIN FAILED WRONG PASSWORD");
    }

    verifyHash(hashedPassword) {
      const verify = this.getDataValue("hashedPassword") === hashedPassword;
      return verify;
      if (verify) {
        return true;
      }
      throw new Error("INVALID PASSWORD HASH");
    }

    static associate(models) {
      // define association here
      User.hasMany(models.School, {
        foreignKey: "ownerId",
        onDelete: "CASCADE",
        hooks: true,
      });
      User.hasMany(models.ClassUser, {
        foreignKey: "userId",
        onDelete: "SET NULL",
        hooks: true,
      });
      User.hasMany(models.SchoolUser, {
        foreignKey: "userId",
        onDelete: "SET NULL",
        hooks: true,
      });
      User.hasMany(models.Attendance, {
        foreignKey: "userId",
        onDelete: "SET NULL",
        hooks: true,
      });
    }
  }
  User.init(
    {
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false },
      phoneNumber: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.VIRTUAL, allowNull: true },
      hashedPassword: { type: DataTypes.STRING, allowNull: false },
      username: { type: DataTypes.STRING, allowNull: false, unique: true },
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeValidate(attributes, options) {
          const { password, hashedPassword } = attributes.toJSON();
          if (password && !hashedPassword) {
            attributes.setDataValue(
              "hashedPassword",
              bcrypt.hashSync(password)
            );
          }
        },
      },
    }
  );
  return User;
};
