const router = require('express').Router();
const { login } = require('../controllers/user');
const { loginValidation } = require('../middlewares/validation/userValidator');

router.post('/', loginValidation, login);

module.exports = router;
