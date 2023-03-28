const router = require('express').Router();
const userRoutes = require('./user'); // Попытаться слить в одно
const cardRoutes = require('./card');
const loginRoutes = require('./signin');
const signupRoutes = require('./signup');
const auth = require('../middlewares/auth');

// Приватные пути
router.use('/users', auth, userRoutes);
router.use('/cards', auth, cardRoutes);

// Публчиные пути
router.use('/signin', loginRoutes);
router.use('/signup', signupRoutes);

module.exports = router;
