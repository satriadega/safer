const { User } = require("../models");
const { signToken } = require("../helpers/jwt");
const { comparePassword } = require("../helpers/bcrypt");

class UserController {
  static async registerUser(req, res, next) {
    const { name, email, password, gender, phoneNumber, address } = req.body;
    try {
      if (gender !== "male" && gender !== "female") {
        throw { name: "Not Valid" };
      }
      const newUser = await User.create({
        name,
        email,
        password,
        gender,
        phoneNumber,
        address,
      });
      console.log(newUser);
      res.status(201).json({ id: newUser.id, email: newUser.email });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async loginUser(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email) {
        throw { name: "Invalid Login" };
      }
      if (!password) {
        throw { name: "Invalid Login" };
      }
      const user = await User.findOne({
        where: {
          email,
        },
      });
      if (!user) {
        throw { name: "Invalid Login" };
      }

      const isValidPassword = comparePassword(password, user.password);
      if (!isValidPassword) {
        throw { name: "Invalid Login" };
      }

      //generate JWT
      const accessToken = signToken({
        id: user.id,
        email: user.email,
      });
      console.log(accessToken);
      res.status(200).json({
        access_token: accessToken,
        email: user.email,
        name: user.name,
        id: user.id
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) {
        throw { name: "Not Found" };
      }
      res.status(200).json({ user });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = UserController;
