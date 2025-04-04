const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key';

const authenticateToken = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).send({ message: 'Access token is missing or invalid' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).send({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};
module.exports = authenticateToken;