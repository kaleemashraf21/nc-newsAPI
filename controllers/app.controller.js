const endPointsJSON = require("../endpoints.json");
const {
  fetchTopics,
  fetchArticlesById,
  fetchAllArticles,
  fetchArticlesComments,
} = require("../models/app.model");

exports.getEndpoints = (req, res) => {
  res.status(200).send({ endpoints: endPointsJSON });
};

exports.getTopics = (req, res) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};
exports.getAllArticles = (req, res, next) => {
  fetchAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticlesById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticlesComments = (req, res, next) => {
  const { article_id } = req.params;
  const promises = [fetchArticlesComments(article_id)];

  if (article_id) {
    promises.push(fetchArticlesById(article_id));
  }

  Promise.all(promises)
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
