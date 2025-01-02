const express = require("express");
const router = express.Router();
const {
  getArticles,
  getArticlesById,
  updateArticleVotes,
  getArticleComments,
  postComment,
  postArticle,
  deleteArticle,
} = require("../controllers/app.controller");

router.get("/", getArticles);
router.get("/:article_id", getArticlesById);
router.get("/:article_id/comments", getArticleComments);
router.post("/", postArticle);
router.post("/:article_id/comments", postComment);
router.patch("/:article_id", updateArticleVotes);
router.delete("/:article_id", deleteArticle);

module.exports = router;
