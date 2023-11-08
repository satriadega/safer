const router = require("express").Router();
const UserController = require("../controllers/userController");
const authentication = require("../middleware/authentication");

router.use(authentication);
router.get("/:id", UserController.getUserById);

module.exports = router;
