const STATUS = require('../utils/constants/status');
const {
  DEFAULT_CODE,
  NOT_FOUND_CODE,
  INVALID_DATA_CODE,
} = require('../utils/constants/status-code');
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(() => res.status(DEFAULT_CODE).send({ message: STATUS.DEFAULT_ERROR }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_CODE).send({ message: STATUS.USER_NOT_FOUND });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(INVALID_DATA_CODE).send({ message: STATUS.BAD_REQUEST });
      }
      return res.status(DEFAULT_CODE).send({ message: STATUS.DEFAULT_ERROR });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(INVALID_DATA_CODE).send({ message: STATUS.INVALID_USER });
      }
      return res.status(DEFAULT_CODE).send({ message: STATUS.DEFAULT_ERROR });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_CODE).send({ message: STATUS.USER_NOT_FOUND });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(INVALID_DATA_CODE).send({ message: STATUS.INVALID_USER });
      }
      return res.status(DEFAULT_CODE).send({ message: STATUS.DEFAULT_ERROR });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_CODE).send({ message: STATUS.USER_NOT_FOUND });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(INVALID_DATA_CODE).send({ message: STATUS.INVALID_AVATAR_UPDATE });
      }
      return res.status(DEFAULT_CODE).send({ message: STATUS.DEFAULT_ERROR });
    });
};
