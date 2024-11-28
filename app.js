const express = require("express");
const {
  getEndpoints,
  getTopics,
  getArticlesById,
  getArticles,
  getArticleComments,
  postComment,
  updateArticleVotes,
  deleteComment,
  getUsers,
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

app.get("/api/users", getUsers);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", updateArticleVotes);

app.delete("/api/comments/:comment_id", deleteComment);

app.all("*", allEndpointErrorHandler);
app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
