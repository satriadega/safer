const { Vote } = require("../models");

const authorizationUpdate = async (req, res, next) => {
  const { id } = req.params;
  console.log(id);

  try {
    const findVote = await Vote.findByPk(+id);

    console.log(findVote);
    if (!findVote) {
      throw { name: "Not Found" };
    } else if (findVote.UserId !== req.user.id) {
      throw { name: "Status false" };
    } else {
      next();
    }
  } catch (err) {
    // console.log(err);
    next(err);
  }
};

module.exports = { authorizationUpdate };
