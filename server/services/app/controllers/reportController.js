const { Report, User, Type, sequelize } = require("../models");
const geoLocation = require("../helpers/geocoder");

class ReportController {
  static async postReport(req, res, next) {
    try {
      const {
        title,
        description,
        mainImage,
        TypeId,
        latitude,
        latitudeDelta,
        longitude,
        longitudeDelta,
      } = req.body;
      const userId = req.user.id;
      const trx = await sequelize.transaction();
      try {
        const location = await geoLocation(latitude, longitude);
        const newReport = await Report.create(
          {
            title,
            description,
            mainImage,
            UserId: userId,
            TypeId,
            latitude,
            latitudeDelta,
            longitude,
            longitudeDelta,
            location,
          },
          { transaction: trx }
        );

        await trx.commit();
        console.log(newReport);
        res.status(201).json({ newReport });
      } catch (err) {
        console.log(err);
        next(err);
        await trx.rollback();
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async getReportList(req, res, next) {
    try {
      const reports = await Report.findAll({
        include: [Type, User],
        order: [["createdAt", "DESC"]],
      });
      res.status(200).json(reports);
      console.log(reports);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async getReportById(req, res, next) {
    try {
      const { id } = req.params;
      const report = await Report.findByPk(+id, {
        include: [User],
      });
      if (!report) {
        throw { name: "Not Found" };
      } else {
        res.status(200).json({ report });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = ReportController;
