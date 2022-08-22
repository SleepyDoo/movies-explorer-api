const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const NotFoundErr = require('../errors/notFoundErr');
const BadLoginErr = require('../errors/badLoginErr');
const ConflictErr = require('../errors/conflictErr');
const ValidationErr = require('../errors/validationErr');

let JWT_SECRET;

if (process.env.NODE_ENV !== 'production') {
  JWT_SECRET = 'secret';
} else {
  JWT_SECRET = process.env.JWT_SECRET;
}

const SALT_NUM = 10;

module.exports.getCurrentUser = (req, res, next) => {
  console.log(req.user);
  User.findById(req.user._id)
    .then((user) => {
      console.log(user);
      if (!user) {
        throw new NotFoundErr('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findOneAndUpdate({ _id: req.user._id }, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if ((user === null)) {
        throw new NotFoundErr('Пользователь не найден');
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictErr('Почта уже занята'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new BadLoginErr('Неверные пароль или почта');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new BadLoginErr('Неверные пароль или почта');
          }
          const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
            expiresIn: '7d',
          });
          res.cookie('jwt', token, {
            maxAge: 3600000,
            httpOnly: true,
            sameSite: true,
          });
          res.send({ data: token });
        });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, SALT_NUM)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.send({
      data: {
        name: user.name, email: user.email,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationErr('Переданы некорректные данные'));
      }
      if (err.code === 11000) {
        next(new ConflictErr('Почта уже занята'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, SALT_NUM)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.send({
      data: {
        name: user.name, email: user.email,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationErr('Переданы некорректные данные'));
      }
      if (err.code === 11000) {
        next(new ConflictErr('Почта уже занята'));
      }
      next(err);
    });
};
