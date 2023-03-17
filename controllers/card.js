const Card = require('../models/card');
const STATUS = require('../utils/constants/status');
const ApplicationError = require('../errors/ApplicationError');
const ValidationError = require('../errors/ValidationError');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => {
      res.status(200).send(card);
    })
    .catch(() => {
      throw new ApplicationError();
    })
    .catch((err) => res.status(err.statusCode).send(err));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError(STATUS.INVALID_CARD_CREATE);
      } else {
        throw new ApplicationError();
      }
    })
    .catch((err) => res.status(err.statusCode).send(err));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound(STATUS.CARD_NOT_FOUND);
      }
      return res.status(200).send({ message: 'Карточка удалена' });
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

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFound(STATUS.CARD_NOT_FOUND);
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
        return res.status(err.statusCode).send(err);
      }
      if (err.name === 'CastError') {
        throw new BadRequest(STATUS.BAD_LIKE_REQ);
      } else {
        throw new ApplicationError();
      }
    })
    .catch((err) => res.status(err.statusCode).send(err));
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFound(STATUS.CARD_NOT_FOUND);
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
        return res.status(err.statusCode).send(err);
      }
      if (err.name === 'CastError') {
        throw new BadRequest(STATUS.BAD_LIKE_REQ);
      } else {
        throw new ApplicationError();
      }
    })
    .catch((err) => res.status(err.statusCode).send(err));
};
