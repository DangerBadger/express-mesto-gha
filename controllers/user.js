const bcrypt = require('bcryptjs');
const User = require('../models/user');
const STATUS = require('../utils/constants/status');
const ApplicationError = require('../errors/ApplicationError');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const ValidationError = require('../errors/ValidationError');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(() => {
      throw new ApplicationError();
    })
    .catch((err) => res.status(err.statusCode).send(err));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFound(STATUS.USER_NOT_FOUND);
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
        return res.status(err.statusCode).send(err);
      }
      if (err.name === 'CastError') {
        throw new BadRequest(STATUS.BAD_REQUEST);
      } else {
        throw new ApplicationError();
      }
    })
    .catch((err) => res.status(err.statusCode).send(err));
};

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(200).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError(STATUS.INVALID_USER);
      } else {
        throw new ApplicationError();
      }
    })
    .catch((err) => res.status(err.statusCode).send(err));
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFound(STATUS.USER_NOT_FOUND);
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
        return res.status(err.statusCode).send(err);
      }
      if (err.name === 'ValidationError') {
        throw new ValidationError(STATUS.INVALID_INFO_UPDATE);
      } else {
        throw new ApplicationError();
      }
    })
    .catch((err) => res.status(err.statusCode).send(err));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFound(STATUS.USER_NOT_FOUND);
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
        return res.status(err.statusCode).send(err);
      }
      if (err.name === 'ValidationError') {
        throw new ValidationError(STATUS.INVALID_AVATAR_UPDATE);
      } else {
        throw new ApplicationError();
      }
    })
    .catch((err) => res.status(err.statusCode).send(err));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {

    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });

  // User.findOne({ email })
  //   .then((user) => {
  //     if (!user) {
  //       throw new NotFound('Неверная почта или пароль');
  //     }
  //     return bcrypt.compare(password, user.password);
  //   })
  //   .catch((err) => {
  //     if (err.name === 'NotFound') {
  //       return res.status(401).send(err);
  //     }
  //     if (err.name === 'ValidationError') {
  //       throw new ValidationError(STATUS.INVALID_AVATAR_UPDATE);
  //     } else {
  //       throw new ApplicationError();
  //     }
  //   })
  //   .catch((err) => res.status(err.statusCode).send(err));
};
