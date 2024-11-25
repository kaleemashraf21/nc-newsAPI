const express = require("express");
const { getEndpoints, getTopics } = require("./controllers/app.controller");
const { customErrorHandler, serverErrorHandler } = require("./errors");
const app = express();

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.all("*", (req, res) => {
  res.status(400).send({ msg: "Route Not Found" });
});

app.use(serverErrorHandler);

module.exports = app;
