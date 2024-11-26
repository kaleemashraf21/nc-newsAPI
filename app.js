const express = require("express");
const {
  getEndpoints,
  getTopics,
  getArticlesById,
  getAllArticles,
  getArticlesComments,
} = require("./controllers/app.controller");
const {
  customErrorHandler,
  serverErrorHandler,
  allEndpointErrorHandler,
  psqlErrorHandler,
} = require("./errors");

const app = express();

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles/:article_id/comments", getArticlesComments);

app.all("*", allEndpointErrorHandler);
app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
