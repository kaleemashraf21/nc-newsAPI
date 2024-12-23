const express = require("express");
const router = express.Router();
const {
  getArticles,
  getArticlesById,
  updateArticleVotes,
  getArticleComments,
  postComment,
  postArticle,
} = require("../controllers/app.controller");

router.get("/", getArticles);
router.post("/", postArticle);
router.get("/:article_id", getArticlesById);
router.patch("/:article_id", updateArticleVotes);
router.get("/:article_id/comments", getArticleComments);
router.post("/:article_id/comments", postComment);

module.exports = router;
