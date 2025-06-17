const router = require("express").Router();
const TypeController = require("../controllers/typeController");

router.get("/", TypeController.getTypeList);
router.post("/", TypeController.postType);

module.exports = router;
