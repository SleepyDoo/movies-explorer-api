const jwt = require('jsonwebtoken');
const BadLoginErr = require('../errors/badLoginErr');

let JWT_SECRET;

if (process.env.NODE_ENV !== 'production') {
  JWT_SECRET = 'secret';
} else {
  JWT_SECRET = process.env.JWT_SECRET;
}

module.exports.auth = (req, res, next) => {
  let token = null;
  if (req.headers.authorization) {
    console.log(req.headers);
    console.log(req.headers.authorization);
    token = req.headers.authorization.replace('Bearer ', '');
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new BadLoginErr('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};
