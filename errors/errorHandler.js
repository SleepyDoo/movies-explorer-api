module.exports.errorHandler = (err, req, res, next) => {
  if (!err.status) {
    res.status(500).send({ message: 'Произошла ошибка на стороне сервера' });
    return;
  }
  res.status(err.status).send({ message: err.message });
  next();
};
