"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Report.belongsTo(models.User);
      Report.belongsTo(models.Type);
      Report.hasMany(models.Vote);
      // define association here
    }
  }
  Report.init(
    {
      UserId: DataTypes.INTEGER,
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Title is required" },
          notEmpty: { msg: "Title is required" },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: "Description is required" },
          notEmpty: { msg: "Description is required" },
        },
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

      location: {
        type: DataTypes.STRING,
      },
      TypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Type is required" },
          notEmpty: { msg: "Type is required" },
        },
      },

      mainImage: DataTypes.STRING,
      latitude: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Latitude is required" },
          notEmpty: { msg: "Latitude is required" },
        },
      },
      latitudeDelta: DataTypes.STRING,
      longitude: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Longitude is required" },
          notEmpty: { msg: "Longitude is required" },
        },
      },
      longitudeDelta: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Report",
    }
  );
  return Report;
};
