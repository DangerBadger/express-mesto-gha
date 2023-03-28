const router = require('express').Router();
const { createUser } = require('../controllers/user');
const { registerValidation } = require('../middlewares/validation/userValidator');

router.post('/', registerValidation, createUser);

module.exports = router;
