const router = require("express").Router();
const ReportController = require("../controllers/reportController");
const authentication = require("../middleware/authentication");

router.get("/", ReportController.getReportList);
router.get("/:id", ReportController.getReportById);
router.use(authentication);
router.post("/", ReportController.postReport);

module.exports = router;
