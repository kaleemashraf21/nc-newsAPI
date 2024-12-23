const express = require("express");
const apiRouter = express.Router();

const articlesRouter = require("./articlesRouter");
const commentsRouter = require("./commentsRouter");
const usersRouter = require("./usersRouter");
const topicsRouter = require("./topicsRouter");

const { getEndpoints } = require("../controllers/app.controller");
apiRouter.get("/", getEndpoints);

apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/topics", topicsRouter);

module.exports = apiRouter;
