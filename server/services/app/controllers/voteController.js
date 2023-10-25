const { Op } = require("sequelize");
const { Vote, Report, User } = require("../models");

class VoteController {
  static async getVotes(req, res, next) {
    try {
      const result = await Vote.findAll({
        order: [["createdAt", "DESC"]],
        include: [Report, User],
      });
      res.status(200).json({ result });
    } catch (err) {
      next(err);
    }
  }

  static async getVoteById(req, res, next) {
    try {
      const { id } = req.params;
      console.log(id);
      const vote = await Vote.findByPk(+id, {
        include: [Report],
      });
      if (!vote) {
        throw { name: "Not Found" };
      } else {
        res.status(200).json({ vote });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async postVote(req, res, next) {
    try {
      const { status, comment, ReportId, image } = req.body;
      const userId = req.user.id;

      console.log("ReportId", ReportId);
      if (!ReportId) {
        throw { name: "Not Valid" };
      }

      if (status !== "like" && status !== "dislike") {
        throw { name: "Not Valid" };
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
        where: { ReportId: +ReportId },
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

      if (countDislike.length >= 6) {
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
    try {
      const { id } = req.params;
      console.log(id);
      const { status, comment, image } = req.body;
      if (status !== "like" && status !== "dislike") {
        throw { name: "Not Valid" };
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
        }
      );
      console.log(result);
      if (!result[0]) {
        throw { name: "Not Valid" };
      } else {
        res.status(200).json({ message: `Vote successfully updated` });
      }
    } catch (err) {
      next(err);
    }
  }

  static async getVoteByReportId(req, res, next) {
    try {
      const { id } = req.params;
      const voteByReport = await Vote.findAll({
        where: {
          ReportId: id,
        },
        include: [User],
      });
      if (!voteByReport) {
        throw { name: "Not Found" };
      } else {
        res.status(200).json(voteByReport);
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = VoteController;
