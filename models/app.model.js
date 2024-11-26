const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => rows);
};

exports.fetchAllArticles = () => {
  const queryText = `SELECT 
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

  return db.query(queryText).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "No articles found",
      });
    }
    return rows;
  });
};

exports.fetchArticlesById = (article_id) => {
  const queryText = "SELECT * FROM articles WHERE article_id = $1";

  return db.query(queryText, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "Article Not Found",
      });
    }
    return rows[0];
  });
};
