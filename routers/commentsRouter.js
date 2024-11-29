const express = require("express");
const router = express.Router();
const { deleteComment } = require("../controllers/app.controller");

router.delete("/:comment_id", deleteComment);

module.exports = router;
