"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Type.hasMany(models.Report, { foreignKey: "TypeId" });
    }
  }
  Type.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Name already registered" },
        validate: {
          notEmpty: { msg: "Name is required" },
          notNull: { msg: "Name is required" },
        },
      },
    },
    {
      sequelize,
      modelName: "Type",
    }
  );
  return Type;
};
