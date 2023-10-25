"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Vote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Vote.belongsTo(models.User, { foreignKey: "UserId" });
      Vote.belongsTo(models.Report, { foreignKey: "ReportId" });
    }
  }
  Vote.init(
    {
      status: {
        type: DataTypes.STRING,
        // allowNull: false,
        // validate: {
        //   notNull: { msg: "Status is required" },
        //   notEmpty: { msg: "Status is required" },
        // },
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "UserId is required" },
          notEmpty: { msg: "UserId is required" },
        },
      },
      comment: {
        type: DataTypes.TEXT,
        // allowNull: false,
        // validate: {
        //   notNull: { msg: "Comment is required" },
        //   notEmpty: { msg: "Comment is required" },
        // },
      },
      ReportId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "ReportId is required" },
          notEmpty: { msg: "ReportId is required" },
        },
      },
      image: {
        type: DataTypes.STRING,

        allowNull: true,

      },
    },
    {
      sequelize,
      modelName: "Vote",
    }
  );
  return Vote;
};
