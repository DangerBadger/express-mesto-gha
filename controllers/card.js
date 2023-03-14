const STATUS = require('../utils/constants/status');
const {
  DEFAULT_CODE,
  NOT_FOUND_CODE,
  INVALID_DATA_CODE,
} = require('../utils/constants/status-code');
const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => {
      res.status(200).send(card);
    })
    .catch(() => res.status(DEFAULT_CODE).send({ message: STATUS.DEFAULT_ERROR }));
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
        return res.status(INVALID_DATA_CODE).send({ message: STATUS.INVALID_CARD_CREATE });
      }
      return res.status(DEFAULT_CODE).send({ message: STATUS.DEFAULT_ERROR });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_CODE).send({ message: STATUS.CARD_NOT_FOUND });
      }
      return res.status(200).send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(INVALID_DATA_CODE).send({ message: STATUS.INVALID_CARD });
      }
      return res.status(DEFAULT_CODE).send({ message: STATUS.DEFAULT_ERROR });
    });
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
        return res.status(NOT_FOUND_CODE).send({ message: STATUS.CARD_NOT_FOUND });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(INVALID_DATA_CODE).send({ message: STATUS.BAD_LIKE_REQ });
      }
      return res.status(DEFAULT_CODE).send({ message: STATUS.DEFAULT_ERROR });
    });
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
        return res.status(NOT_FOUND_CODE).send({ message: STATUS.CARD_NOT_FOUND });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(INVALID_DATA_CODE).send({ message: STATUS.BAD_LIKE_REQ });
      }
      return res.status(DEFAULT_CODE).send({ message: STATUS.DEFAULT_ERROR });
    });
};
