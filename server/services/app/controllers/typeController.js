const { Type, sequelize } = require("../models");

class TypeController {
  static async postType(req, res, next) {
    try {
      const { name } = req.body;
      try {
        const newType = await Type.create({ name });
        console.log(newType);
        res.status(201).json(newType);
      } catch (err) {
        console.log(err);
        next(err);
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async getTypeList(req, res, next) {
    try {
      const types = await Type.findAll({
        order: [["createdAt", "DESC"]],
      });
      res.status(200).json(types);
      console.log(types);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = TypeController;
