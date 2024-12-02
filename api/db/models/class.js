"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Class.belongsTo(models.School, {
        foreignKey: "schoolId",
      });
      Class.hasMany(models.ClassUser, {
        foreignKey: "classId",
        onDelete: "CASCADE",
        hooks: true,
      });
      Class.hasMany(models.ClassTime, {
        foreignKey: "classId",
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  Class.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      schoolId: {
        type: DataTypes.INTEGER,
        references: {
          model: "School",
          key: "id",
        },
      },
      level: { type: DataTypes.STRING, allowNull: true },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Class",
    }
  );
  return Class;
};
