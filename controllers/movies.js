const Movie = require('../models/movie');
const NotFoundErr = require('../errors/notFoundErr');
const ValidationErr = require('../errors/validationErr');
const ForbiddenErr = require('../errors/forbiddenErr');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration,
    year, description, image, trailerLink,
    nameRU, nameEN, thumbnail, movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationErr('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if ((!movie)) {
        throw new NotFoundErr('Фильм не найден');
      }
      if (movie.owner._id.toString() !== req.user._id) {
        throw new ForbiddenErr('Вы можете удалять только свои фильмы');
      }
      return movie.remove().then(() => { res.send({ message: 'Фильм удален' }); });
    })
    .catch(next);
};
