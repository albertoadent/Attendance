"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Attendance.belongsTo(models.School, {
        foreignKey: "schoolId",
      });
      Attendance.belongsTo(models.ClassTime, {
        foreignKey: "classTimeId",
      });
      Attendance.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  Attendance.init(
    {
      schoolId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "School",
          key: "id",
        },
      },
      classTimeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Class",
          key: "id",
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "User",
          key: "id",
        },
      },
      date: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "Attendance",
      hooks: {
        async beforeCreate(attendance, options) {
          const { schoolId, classTimeId } = attendance.toJSON();
          if (!schoolId) {
            const cls = await sequelize.models.Class.findByPk(classTimeId);
            attendance.setDataValue(schoolId, cls.id);
          }
        },
      },
    }
  );
  return Attendance;
};
