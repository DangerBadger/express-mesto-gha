const { Error } = require('mongoose');
const Card = require('../models/card');
const STATUS = require('../utils/constants/status');
const NotFound = require('../utils/errors/NotFound');
const BadRequest = require('../utils/errors/BadRequest');
const Forbidden = require('../utils/errors/Forbidden');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
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
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        next(new BadRequest(STATUS.INVALID_CARD_CREATE));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
  // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        throw new NotFound(STATUS.CARD_NOT_FOUND);
      }
      if (card.owner.toString() !== req.user._id) {
        throw new Forbidden(STATUS.FORBIDDEN_CARD);
      }
      if (card.owner.toString() === req.user._id) {
        return Card.deleteOne({ _id: cardId })
          .then(() => {
            res.status(200).send({ message: 'Карточка удалена' });
          });
      }
    })
    .catch((err) => {
      if (err instanceof Error.CastError) {
        next(new BadRequest(STATUS.BAD_REQUEST));
      } else {
        next(err);
      }
    });
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
        throw new NotFound(STATUS.CARD_NOT_FOUND);
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err instanceof Error.CastError) {
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
        throw new NotFound(STATUS.CARD_NOT_FOUND);
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err instanceof Error.CastError) {
        next(new BadRequest(STATUS.BAD_LIKE_REQ));
      } else {
        next(err);
      }
    });
};
