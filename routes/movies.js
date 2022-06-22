const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { paramIdVal, newMovieVal } = require('../middlewares/validation');

router.get('/movies', getMovies);
router.post('/movies', newMovieVal, createMovie);
router.delete('/movies/:_id', paramIdVal, deleteMovie);

module.exports = router;
