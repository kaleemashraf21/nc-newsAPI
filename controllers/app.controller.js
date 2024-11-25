const endPointsJSON = require("../endpoints.json");
exports.getEndpoints = (req, res) => {
  res.status(200).send({ endpoints: endPointsJSON });
};
