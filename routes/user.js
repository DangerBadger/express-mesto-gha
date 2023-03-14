const userRouter = require('express').Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/user');

userRouter.get('/', getUsers);

userRouter.get('/:id', getUser);

userRouter.post('/', createUser);

userRouter.patch('/me', updateUserInfo);

userRouter.patch('/me/avatar', updateAvatar);

module.exports = userRouter;
