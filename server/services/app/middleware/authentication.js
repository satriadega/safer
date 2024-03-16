const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

const authentication = async function (req, res, next) {
  try {
    const { access_token } = req.headers;

    if (!access_token) {
      throw { name: "unauthenticated" };
    }
    const decoded = verifyToken(access_token);
    const findUser = await User.findOne({
      where: {
        id: decoded.id,
        email: decoded.email,
      },
    });
    if (!findUser) {
      throw { name: "unauthenticated" };
    }
    req.user = {
      id: findUser.id,
      name: findUser.name,
    };

    next();
  } catch (err) {
    console.log(err);
    err.name = "unauthenticated";
    next(err);
  }
};

module.exports = authentication;
