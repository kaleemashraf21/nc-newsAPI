const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => rows);
};

exports.checkTopicExists = (topic) => {
  return db
    .query(`SELECT slug FROM topics WHERE slug = $1;`, [topic])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 400, msg: "Bad Request" });
      }
    });
};

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => rows);
};

exports.fetchArticles = (
  sort_by = "created_at",
  order = "desc",
  topic,
  limit = 10,
  page = 1
) => {
  const validSortBy = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];
  const validOrderSort = ["asc", "desc"];

  if (!validSortBy.includes(sort_by) || !validOrderSort.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  let queryValues = [];

  let countQuery = `SELECT COUNT(*) FROM articles`;

  let query = `SELECT 
      articles.article_id, 
      articles.title, 
      articles.author, 
      articles.topic, 
      articles.created_at, 
      articles.votes, 
      articles.article_img_url, 
      CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id`;

  if (topic) {
    countQuery += ` WHERE articles.topic = $1`;
    query += ` WHERE articles.topic = $1`;
    queryValues.push(topic);
  }

  return db.query(countQuery, queryValues).then(({ rows }) => {
    const total_count = parseInt(rows[0].count, 10);

    const offset = (page - 1) * limit;

    queryValues.push(limit, offset);

    query += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order} `;
    query += ` LIMIT $${queryValues.length - 1} OFFSET $${queryValues.length}`;

    return db.query(query, queryValues).then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "No Articles Found",
        });
      }
      return { articles: rows, total_count };
    });
  });
};

exports.fetchArticlesById = (article_id) => {
  const query = `SELECT
        articles.*, 
        CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count
        FROM articles
        LEFT JOIN comments
        ON comments.article_id = articles.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id `;

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

exports.fetchUsersByUsername = (username) => {
  const query = `SELECT * FROM users WHERE username = $1 `;

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

exports.fetchArticleComments = (article_id, limit = 10, page = 1) => {
  const offset = (page - 1) * limit;

  const query = `
    SELECT * FROM comments 
    WHERE article_id = $1 
    ORDER BY created_at DESC 
    LIMIT $2 OFFSET $3
  `;

  return db.query(query, [article_id, limit, offset]).then(({ rows }) => {
    if (!rows.length && offset > rows.length) {
      return Promise.reject({ status: 404, msg: "No Comments Found" });
    }
    return rows;
  });
};

exports.insertComment = (article_id, username, body) => {
  const query = `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING * `;

  return db
    .query(query, [article_id, username, body])
    .then(({ rows }) => rows[0]);
};

exports.insertArticle = (author, title, body, topic, article_img_url) => {
  const query = `INSERT INTO articles (author, title, body, topic, article_img_url)
    VALUES ($1, $2, $3, $4, $5) RETURNING * `;

  return db
    .query(query, [author, title, body, topic, article_img_url])
    .then(({ rows }) => rows[0]);
};

exports.insertTopic = (slug, description) => {
  const checkQuery = "SELECT * FROM topics WHERE slug = $1";
  const invalidSlugPattern = /[^a-zA-Z]/;
  if (!slug || !description || invalidSlugPattern.test(slug)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  return db.query(checkQuery, [slug]).then(({ rows }) => {
    if (rows.length) {
      return Promise.reject({
        status: 409,
        msg: "Topic already exists",
      });
    }

    const query = `INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING slug, description`;
    return db.query(query, [slug, description]).then(({ rows }) => rows[0]);
  });
};

exports.patchCommentVotes = (comment_id, inc_votes) => {
  const query = `
    UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *;
  `;

  return db.query(query, [inc_votes, comment_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Comment Not Found" });
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

exports.deleteArticleById = (article_id) => {
  const deleteCommentsQuery = `DELETE FROM comments WHERE article_id = $1`;
  const deleteArticleQuery = `DELETE FROM articles WHERE article_id = $1 RETURNING *`;

  return db
    .query(deleteCommentsQuery, [article_id])
    .then(() => {
      return db.query(deleteArticleQuery, [article_id]);
    })
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Article Not Found" });
      }
    });
};
