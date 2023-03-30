const router = require('express').Router();
const userRoutes = require('./user'); // Попытаться слить в одно
const cardRoutes = require('./card');
const loginRoutes = require('./signin');
const signupRoutes = require('./signup');
const auth = require('../middlewares/auth');
const NotFound = require('../utils/errors/NotFound');
const STATUS = require('../utils/constants/status');

// Приватные пути
router.use('/users', auth, userRoutes);
router.use('/cards', auth, cardRoutes);

// Публчиные пути
router.use('/signin', loginRoutes);
router.use('/signup', signupRoutes);

// Обработка любого несуществующего рута
router.use('*', (req, res, next) => next(new NotFound(STATUS.NOT_FOUND)));

module.exports = router;
