const router = require("express").Router();
const UserController = require("../controllers/userController");
const { authorizationUpdate } = require("../middleware/authorization");

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.get("/users/:id", UserController.getUserById);

module.exports = router;
