const jwt = require("jsonwebtoken");
require("dotenv").config();

const HASH_SECRET = process.env.HASH_SECRET;

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ error: "No token provided." });
  }

  const parts = authHeader.split(" ");

  if (!parts.length === 2) {
    return res.status(401).send({ error: "No token provided." });
  }

  const [scheme, token] = parts; //scheme = parts[0] e token = parts[1]

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ error: "Token malformatted." });
  } else {
    jwt.verify(token, HASH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({ error: "Invalid token." });
      }

      req.userId = decoded.id;
      return next();
    });
  }
};
