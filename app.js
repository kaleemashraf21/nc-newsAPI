const express = require("express");
const app = express();
const apiRouter = require("./routers/apiRouter");

const {
  customErrorHandler,
  serverErrorHandler,
  allEndpointErrorHandler,
  psqlErrorHandler,
} = require("./errors");

app.use(express.json());

app.use("/api", apiRouter);

// Handle all other undefined routes
app.all("*", allEndpointErrorHandler);

// Error Handlers
app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
