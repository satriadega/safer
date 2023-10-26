const { Type, sequelize } = require("../models");

class TypeController {
  static async postType(req, res, next) {
    try {
      const { name, adminVerificator } = req.body;
      try {
        if (adminVerificator !== "55555" || !adminVerificator) {
          throw { name: "Status false" };
        }
        const newType = await Type.create({ name });
        res.status(201).json(newType);
      } catch (err) {
        console.log(err);
        next(err);
      }
    } catch (err) {
      next(err);
    }
  }

  static async getTypeList(req, res, next) {
    try {
      const types = await Type.findAll({
        order: [["createdAt", "DESC"]],
      });
      res.status(200).json(types);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = TypeController;
