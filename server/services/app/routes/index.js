const router = require("express").Router();
const userRoute = require("./userRoute");
const reportRoute = require("./reportRoute");
const voteRoute = require("./voteRoute");
const typeRoute = require("./typeRoute");
const UserController = require("../controllers/userController");

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.use("/users", userRoute);
router.use("/reports", reportRoute);
router.use("/votes", voteRoute);
router.use("/types", typeRoute);

module.exports = router;
