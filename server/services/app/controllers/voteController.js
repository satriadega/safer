const { Vote, Report, User, sequelize } = require("../models");

class VoteController {
  static async getVotes(req, res, next) {
    try {
      const result = await Vote.findAll({
        order: [["createdAt", "DESC"]],
        include: [
          { model: User, attributes: { exclude: ["password"] } },
          { model: Report },
        ],
      });
      res.status(200).json({ result });
    } catch (err) {
      next(err);
    }
  }

  static async getVoteById(req, res, next) {
    try {
      const { id } = req.params;
      // console.log(id);
      const vote = await Vote.findByPk(+id, {
        include: [Report],
      });
      if (!vote) {
        throw { name: "Not Found" };
      } else {
        res.status(200).json({ vote });
      }
    } catch (err) {
      next(err);
    }
  }

  static async postVote(req, res, next) {
    try {
      const { status, comment, ReportId, image } = req.body;
      const userId = req.user.id;

      if (ReportId === undefined) {
        throw { name: "ReportId not defined" };
      }

      if (status !== "like" && status !== "dislike") {
        throw { name: "Status must be like or dislike" };
      }

      const report = await Report.findByPk(+ReportId);
      if (!report) {
        throw { name: "Not Found" };
      }

      const checkReportStatus = await Report.findByPk(+ReportId);
      if (checkReportStatus.isActive === false) {
        throw {
          name: "Status false",
        };
      }

      const checkAlreadyPost = await Vote.findAll({
        where: { ReportId: +ReportId, UserId: +userId },
      });

      // Activate when going live
      if (checkAlreadyPost.length >= 1) {
        throw {
          name: "Status false",
        };
      }

      const newVote = await Vote.create({
        status,
        ReportId,
        comment,
        UserId: userId,
        image,
      });

      const countDislike = await Vote.findAll({
        where: { status: "dislike", ReportId: +ReportId },
      });

      // dislike threshold
      if (countDislike.length > 1) {
        await Report.update(
          {
            isActive: false,
          },
          {
            where: {
              id: +ReportId,
            },
          }
        );
      }

      res.status(201).json({ newVote });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async updateVoteById(req, res, next) {
    const { id } = req.params;
    const { status, comment, image, ReportId } = req.body;
    const trx = await sequelize.transaction();

    try {
      if (status !== "like" && status !== "dislike") {
        throw { name: "Status must be like or dislike" };
      }
      if (ReportId === undefined) {
        throw { name: "ReportId not defined" };
      }

      let result = await Vote.update(
        {
          status,
          comment,
          image,
        },
        {
          where: {
            id: +id,
          },
        },
        { transaction: trx }
      );

      const report = await Report.findByPk(+ReportId);
      if (!report) {
        throw { name: "Not Found" };
      }

      const checkReportStatus = report;
      if (checkReportStatus.isActive === false) {
        throw {
          name: "Status false",
        };
      }

      const countDislike = await Vote.findAll({
        where: { status: "dislike", ReportId: +ReportId },
      });

      if (countDislike.length > 1) {
        await Report.update(
          {
            isActive: false,
          },
          {
            where: {
              id: +ReportId,
            },
          }
        );
      }

      await trx.commit();
      if (!result[0]) {
        throw { name: "Not Valid" };
      } else {
        res.status(200).json({ message: `Vote successfully updated` });
      }
    } catch (err) {
      await trx.rollback();
      next(err);
    }
  }

  static async getVoteByReportId(req, res, next) {
    try {
      const { id } = req.params;
      const voteByReport = await Vote.findAll({
        where: {
          ReportId: +id,
        },
        include: [{ model: User, attributes: { exclude: ["password"] } }],
      });

      if (voteByReport.length === 0) {
        throw { name: "Not Found" };
      } else {
        res.status(200).json(voteByReport);
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = VoteController;
