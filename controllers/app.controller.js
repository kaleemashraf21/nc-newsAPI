const endPointsJSON = require("../endpoints.json");
const {
  fetchTopics,
  fetchArticlesById,
  fetchAllArticles,
  fetchArticleComments,
  fetchUsersByUsername,
  insertComment,
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

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticlesById(article_id)
    .then(() => {
      return fetchArticleComments(article_id);
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  if (!username || !body) {
    return next({
      status: 400,
      msg: "Bad Request",
    });
  }

  const promises = [
    fetchArticlesById(article_id),
    fetchUsersByUsername(username),
  ];

  Promise.all(promises)
    .then(([article, user]) => {
      return insertComment(article_id, username, body);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
