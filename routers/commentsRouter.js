const express = require("express");
const router = express.Router();

const {
  deleteComment,
  updateCommentVotes,
} = require("../controllers/app.controller");

router.delete("/:comment_id", deleteComment);
router.patch("/:comment_id", updateCommentVotes);

module.exports = router;
