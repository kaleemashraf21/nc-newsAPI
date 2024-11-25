const endPointsJSON = require("../endpoints.json");
const { fetchTopics } = require("../models/app.model");

exports.getEndpoints = (req, res) => {
  res.status(200).send({ endpoints: endPointsJSON });
};

exports.getTopics = (req, res) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};
