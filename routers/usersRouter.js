const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUsersByUsername,
} = require("../controllers/app.controller");

router.get("/", getUsers);
router.get("/:username", getUsersByUsername);

module.exports = router;
