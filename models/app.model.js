const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => rows);
};

exports.fetchAllArticles = () => {
  const query = `SELECT 
      articles.article_id, 
      articles.title, 
      articles.author, 
      articles.topic, 
      articles.created_at, 
      articles.votes, 
      articles.article_img_url, 
       CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`;

  return db.query(query).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({
        status: 404,
        msg: "No Articles Found",
      });
    }
    return rows;
  });
};

exports.fetchArticlesById = (article_id) => {
  const query = `SELECT * FROM articles WHERE article_id = $1`;

  return db.query(query, [article_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({
        status: 404,
        msg: "Article Not Found",
      });
    }
    return rows[0];
  });
};
exports.fetchArticleComments = (article_id) => {
  const query = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`;

  return db.query(query, [article_id]).then(({ rows }) => rows);
};

exports.insertComment = (article_id, username, body) => {
  const query = `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING * `;

  return db
    .query(query, [article_id, username, body])
    .then(({ rows }) => rows[0]);
};

exports.fetchUsersByUsername = (username) => {
  const query = `SELECT * FROM users WHERE username = $1`;

  return db.query(query, [username]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({
        status: 404,
        msg: "User Not Found",
      });
    }
    return rows[0];
  });
};

exports.patchArticleVotes = (article_id, inc_votes) => {
  const query = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING * `;

  return db.query(query, [inc_votes, article_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Article Not Found" });
    }
    return rows[0];
  });
};

exports.deleteCommentById = (comment_id) => {
  const query = `DELETE FROM comments WHERE comment_id = $1 RETURNING * `;

  return db.query(query, [comment_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Comment Not Found" });
    }
    return;
  });
};
