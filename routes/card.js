const router = require('express').Router();
const { cardValidation, cardIdValidation } = require('../middlewares/validation/cardValidator');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/card');

router.get('/', getCards);

router.post('/', cardValidation, createCard);

router.delete('/:cardId', cardIdValidation, deleteCard);

router.put('/:cardId/likes', cardIdValidation, likeCard);

router.delete('/:cardId/likes', cardIdValidation, dislikeCard);

module.exports = router;
