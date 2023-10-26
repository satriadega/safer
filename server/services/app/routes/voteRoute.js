const router = require("express").Router();
const VoteController = require("../controllers/voteController");
const authentication = require("../middleware/authentication");
const { authorizationUpdate } = require("../middleware/authorization");

router.get("/", VoteController.getVotes);
router.use(authentication);
router.post("/", VoteController.postVote);
router.get("/:id", authorizationUpdate, VoteController.getVoteById);
router.put("/:id", authorizationUpdate, VoteController.updateVoteById);

module.exports = router;
