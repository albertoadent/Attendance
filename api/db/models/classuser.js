"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ClassUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ClassUser.belongsTo(models.User, {
        foreignKey: "userId",
      });
      
      ClassUser.belongsTo(models.Class, {
        foreignKey: "classId",
      });
    }
  }
  ClassUser.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "id",
        },
      },
      classId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Class",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "ClassUser",
    }
  );
  return ClassUser;
};
