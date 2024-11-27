const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

beforeEach(() => seed(data));

afterAll(() => {
  db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });

  describe("GET /api/topics", () => {
    test("200: Should return an array of topic objects with the necessary properties", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).toHaveLength(data.topicData.length);
          topics.forEach((topic) => {
            expect(topic).toMatchObject({
              description: expect.any(String),
              slug: expect.any(String),
            });
          });
        });
    });

    test("404: Should return an error message if the endpoint is misspelled", () => {
      return request(app)
        .get("/api/topicss")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not Found");
        });
    });
  });

  describe("GET /api/articles", () => {
    test("200: Should return an array of article objects, each containing necessary properties and without a 'body' property and DESC order by their creation", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toHaveLength(data.articleData.length);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
            expect(article).not.toHaveProperty("body");
            expect(articles).toBeSortedBy("created_at", {
              descending: true,
            });
          });
        });
    });

    test("404: Should return an error message for an wrong or misspelled endpoint", () => {
      return request(app)
        .get("/api/articless")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not Found");
        });
    });

    describe("GET /api/articles/:article_id", () => {
      test("200: Should return the article object for a valid article_id", () => {
        return request(app)
          .get("/api/articles/2")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).toMatchObject({
              article_id: 2,
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
            });
          });
      });

      test("400: Should respond with 'Bad request' if an invalid article_id is provided", () => {
        return request(app)
          .get("/api/articles/invalidId")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request");
          });
      });

      test("404: Should return 'Article Not Found' when no article matches the provided article_id", () => {
        return request(app)
          .get("/api/articles/999")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Article Not Found");
          });
      });
    });

    describe("GET /api/articles/:article_id/comments", () => {
      test("200: should fetch all comments for a valid article_id and DESC order by their creation", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(11);
            comments.forEach((comment) => {
              expect(comment).toMatchObject({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                article_id: 1,
              });
              expect(comments).toBeSortedBy("created_at", {
                descending: true,
              });
            });
          });
      });

      test("200: Should respond with '[]' if articles exists but there is no comments", () => {
        return request(app)
          .get("/api/articles/2/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toEqual([]);
          });
      });

      test("400: Should respond with 'Bad request' if an invalid article_id is provided", () => {
        return request(app)
          .get("/api/articles/invalidId/comments")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request");
          });
      });

      test("404: should return 404 if article_id does not exist", () => {
        return request(app)
          .get("/api/articles/999/comments")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Article Not Found");
          });
      });
    });

    describe("?sort_by query on valid columns", () => {
      test("200: should accept a sort_by query eg. 'title' column in descending order (A-Z)", () => {
        return request(app)
          .get("/api/articles?sort_by=title")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(data.articleData.length);
            expect(articles).toBeSortedBy("title", { descending: true });
          });
      });

      test("200: should return articles sorted by default (created_at) in descending order", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(data.articleData.length);
            expect(articles).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });

      test("400: should respond with an error message if sort_by query is invalid", () => {
        return request(app)
          .get("/api/articles?sort_by=invalid")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request");
          });
      });
    });

    describe("?order query", () => {
      test("200: should accept an order query and return articles in ascending order eg. author (Z-A)", () => {
        return request(app)
          .get("/api/articles?sort_by=author&order=asc")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(data.articleData.length);
            expect(articles).toBeSortedBy("author");
          });
      });

      test("200: should accept an order query and return articles in ascending order for created_at", () => {
        return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(data.articleData.length);
            expect(articles).toBeSortedBy("created_at");
          });
      });

      test("400: should respond with an error message if order query is invalid", () => {
        return request(app)
          .get("/api/articles?order=invalid")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request");
          });
      });
    });
    describe("?topic", () => {
      test("200: should return articles filtered by valid topics eg. mitch", () => {
        return request(app)
          .get(`/api/articles?topic=mitch`)
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(
              articles.filter((article) => article.topic === "mitch").length
            );
            articles.forEach(({ topic }) => {
              expect(topic).toBe("mitch");
            });
          });
      });

      test("200: should return articles filtered by valid topic eg. cats", () => {
        return request(app)
          .get(`/api/articles?topic=cats`)
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(
              articles.filter((article) => article.topic === "cats").length
            );
            articles.forEach(({ topic }) => {
              expect(topic).toBe("cats");
            });
          });
      });

      test("400: should respond with an error message if topic query is invalid", () => {
        return request(app)
          .get(`/api/articles?topic=invalid`)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request");
          });
      });
    });
  });

  describe("GET /api/users", () => {
    test("200: Should return an array of user objects with the necessary properties", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).toHaveLength(data.userData.length);
          users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });

    test("404: Should return an error message if the endpoint is misspelled", () => {
      return request(app)
        .get("/api/userss")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not Found");
        });
    });
  });
});

describe("POST /api", () => {
  describe("POST /api/articles/:article_id/comments", () => {
    test("201: Should successfully add a comment for the article and return the posted comment", () => {
      const newComment = {
        username: "butter_bridge",
        body: "This is a test comment!",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: newComment.body,
            article_id: 1,
            author: newComment.username,
            votes: 0,
            created_at: expect.any(String),
          });
        });
    });

    test("400: Should return 'Bad Request' if 'username' or 'body' properties are missing", () => {
      const invalidComment = { body: "This is a test comment!" };
      return request(app)
        .post("/api/articles/1/comments")
        .send(invalidComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        });
    });

    test("400: Should return 'Bad Request' if 'article_id' is invalid", () => {
      const newComment = {
        username: "butter_bridge",
        body: "This is a test comment!",
      };
      return request(app)
        .post("/api/articles/invalidId/comments")
        .send(newComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        });
    });

    test("400: Should return 'Bad Request' if 'username' doesnt exist", () => {
      const newComment = {
        username: "testuser",
        body: "This is a test comment!",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        });
    });

    test("404: Should return 'Article Not Found' if 'article_id' does not exist", () => {
      const newComment = {
        username: "butter_bridge",
        body: "This is a test comment!",
      };
      return request(app)
        .post("/api/articles/999/comments")
        .send(newComment)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Article Not Found");
        });
    });
  });
});

describe("PATCH /api", () => {
  describe("PATCH /api/articles/:article_id", () => {
    test("200: updates the votes and responds with the updated article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -1 })
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toMatchObject({
            article_id: 1,
            votes: expect.any(Number),
          });
          expect(article.votes).toBe(99);
        });
    });

    test("400: invalid article_id ", () => {
      return request(app)
        .patch("/api/articles/not-a-number")
        .send({ inc_votes: 1 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        });
    });

    test("400: invalid inc_votes ", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "one" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        });
    });

    test("400: Missing inc_votes in request body", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        });
    });

    test("404: article_id does not exist", () => {
      return request(app)
        .patch("/api/articles/9999")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Article Not Found");
        });
    });
  });
});

describe("DELETE /API", () => {
  describe("DELETE /api/comments/:comment_id", () => {
    test("204: deletes the given comment and responds with no content", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });

    test("404: comment_id does not exist", () => {
      return request(app)
        .delete("/api/comments/9999")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Comment Not Found");
        });
    });

    test("400: invalid comment_id ", () => {
      return request(app)
        .delete("/api/comments/not-a-number")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        });
    });
  });
});
