const endPointsJSON = require("../endpoints.json");
const { fetchTopics, fetchArticles } = require("../models/app.model");

exports.getEndpoints = (req, res) => {
  res.status(200).send({ endpoints: endPointsJSON });
};

exports.getTopics = (req, res) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};
exports.getArticles = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticles(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
