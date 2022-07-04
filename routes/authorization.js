const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const { loginVal, createUserVal } = require('../middlewares/validation');

router.post('/signin', loginVal, login);
router.post('/signup', createUserVal, createUser);

module.exports = router;