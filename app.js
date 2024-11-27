const express = require("express");
const {
  getEndpoints,
  getTopics,
  getArticlesById,
  getAllArticles,
  getArticleComments,
  postComment,
  updateArticleVotes,
  deleteComment,
} = require("./controllers/app.controller");
const {
  customErrorHandler,
  serverErrorHandler,
  allEndpointErrorHandler,
  psqlErrorHandler,
} = require("./errors");

const app = express();

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", updateArticleVotes);

app.delete("/api/comments/:comment_id", deleteComment);

// Error handling
app.all("*", allEndpointErrorHandler);
app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
