const router = require("express").Router();
const userRoute = require("./userRoute");
const reportRoute = require("./reportRoute");
const voteRoute = require("./voteRoute");
const typeRoute = require("./typeRoute");

router.use("/", userRoute);
router.use("/reports", reportRoute);
router.use("/votes", voteRoute);
router.use("/types", typeRoute);

module.exports = router;
