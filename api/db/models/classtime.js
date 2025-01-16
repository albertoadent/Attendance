"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ClassTime extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ClassTime.belongsTo(models.Class, {
        foreignKey: "classId",
      });
      ClassTime.hasMany(models.Attendance, {
        foreignKey: "classTimeId",
        onDelete: "SET NULL",
        hooks: true,
      });
    }
  }
  ClassTime.init(
    {
      mon: { type: DataTypes.BOOLEAN },
      tue: { type: DataTypes.BOOLEAN },
      wed: { type: DataTypes.BOOLEAN },
      thu: { type: DataTypes.BOOLEAN },
      fri: { type: DataTypes.BOOLEAN },
      sat: { type: DataTypes.BOOLEAN },
      sun: { type: DataTypes.BOOLEAN },
      time: DataTypes.TIME,
      endTime: DataTypes.TIME,
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
      modelName: "ClassTime",
    }
  );
  return ClassTime;
};
