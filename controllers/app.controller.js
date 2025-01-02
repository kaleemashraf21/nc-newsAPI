const endPointsJSON = require("../endpoints.json");
const {
  fetchTopics,
  fetchArticlesById,
  fetchArticles,
  fetchArticleComments,
  insertComment,
  patchArticleVotes,
  deleteCommentById,
  fetchUsers,
  fetchUsersByUsername,
  patchCommentVotes,
  insertArticle,
  checkTopicExists,
  insertTopic,
  deleteArticleById,
} = require("../models/app.model");

exports.getEndpoints = (req, res) => {
  res.status(200).send({ endpoints: endPointsJSON });
};

exports.getTopics = (req, res) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getUsers = (req, res) => {
  fetchUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic, limit = 10, page = 1 } = req.query;

  if (topic) {
    checkTopicExists(topic)
      .then(() => fetchArticles(sort_by, order, topic, limit, page))
      .then((response) => {
        const { articles, total_count } = response;
        res.status(200).send({ articles, total_count });
      })
      .catch(next);
  } else {
    fetchArticles(sort_by, order, undefined, limit, page)
      .then((response) => {
        const { articles, total_count } = response;
        res.status(200).send({ articles, total_count });
      })
      .catch(next);
  }
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
  const { limit = 10, page = 1 } = req.query;

  fetchArticlesById(article_id)
    .then(() => {
      return fetchArticleComments(article_id, limit, page);
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getUsersByUsername = (req, res, next) => {
  const { username } = req.params;

  fetchUsersByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  fetchArticlesById(article_id)
    .then(() => {
      return insertComment(article_id, username, body);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const { author, title, body, topic, article_img_url } = req.body;

  const defaultArticleImgUrl = "https://example.com/default-image.jpg";
  const imgUrl = article_img_url || defaultArticleImgUrl;

  fetchUsersByUsername(author)
    .then((user) => {
      return insertArticle(author, title, body, topic, imgUrl);
    })
    .then((newArticle) => {
      return fetchArticlesById(newArticle.article_id);
    })
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  const { slug, description } = req.body;

  insertTopic(slug, description)
    .then((newTopic) => {
      res.status(201).send({ newTopic });
    })
    .catch(next);
};

exports.updateArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  patchArticleVotes(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.updateCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  patchCommentVotes(comment_id, inc_votes)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  deleteCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.deleteArticle = (req, res, next) => {
  const { article_id } = req.params;

  deleteArticleById(article_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
