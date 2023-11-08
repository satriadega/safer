const router = require("express").Router();
const UserController = require("../controllers/userController");
const authentication = require("../middleware/authentication");

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.use(authentication);
router.get("/users/:id", UserController.getUserById);

module.exports = router;
