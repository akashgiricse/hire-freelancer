const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  //Check if token
  if (!token) {
    return res.status(401).send({ msg: 'No token, authorization denied' });
  }

  // Veryfy token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token not valid' });
  }
};
