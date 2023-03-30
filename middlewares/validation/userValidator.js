const { celebrate, Joi } = require('celebrate');
const { URL_REGEXP } = require('../../utils/constants/urlRegExp');

module.exports.loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.registerValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .empty('')
      .default('Жак-Ив Кусто')
      .min(2)
      .max(30),
    about: Joi.string()
      .empty('')
      .default('Исследователь')
      .min(2)
      .max(30),
    avatar: Joi.string().empty('').default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png').pattern(URL_REGEXP),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.userByIdValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
});

module.exports.userInfoValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

module.exports.avatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(URL_REGEXP),
  }),
});
