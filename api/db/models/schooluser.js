"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SchoolUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SchoolUser.belongsTo(models.School, {
        foreignKey: "schoolId",
      });
      SchoolUser.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  SchoolUser.init(
    {
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "STUDENT",
      },
      schoolId: {
        type: DataTypes.INTEGER,
        references: {
          model: "School",
          key: "id",
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "SchoolUser",
    }
  );
  return SchoolUser;
};
