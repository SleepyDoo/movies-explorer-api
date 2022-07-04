const router = require('express').Router();
const { getCurrentUser, updateUser } = require('../controllers/users');
const { updateUserVal } = require('../middlewares/validation');

router.get('/users/me', getCurrentUser);
router.patch('/users/me', updateUserVal, updateUser);

module.exports = router;
