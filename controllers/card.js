const Card = require('../models/card');
const STATUS = require('../utils/constants/status');
const ValidationError = require('../utils/errors/ValidationError');
const NotFound = require('../utils/errors/NotFound');
const BadRequest = require('../utils/errors/BadRequest');
const Forbidden = require('../utils/errors/Forbidden');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => {
      res.status(200).send(card);
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(STATUS.INVALID_CARD_CREATE));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        next(new NotFound(STATUS.CARD_NOT_FOUND));
      }
      if (card.owner.toString() !== req.user._id) {
        next(new Forbidden(STATUS.FORBIDDEN_CARD));
      }
      if (card && (card.owner.toString() === req.user._id)) {
        Card.findByIdAndDelete(cardId)
          .then(() => {
            res.status(200).send({ message: 'Карточка удалена' });
          });
      } else {
        next(new Error());
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFound(STATUS.CARD_NOT_FOUND));
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest(STATUS.BAD_LIKE_REQ));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFound(STATUS.CARD_NOT_FOUND));
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest(STATUS.BAD_LIKE_REQ));
      } else {
        next(err);
      }
    });
};
