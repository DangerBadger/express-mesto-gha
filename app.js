const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { errors } = require('celebrate'); /* Если запрос не проходит валидацию, celebrate передаст его в этот мидлвэр */
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const STATUS = require('./utils/constants/status');
const NotFound = require('./utils/errors/NotFound');

// Подключение библиотеки для чтения переменных окружения из .env
require('dotenv').config();

// Объявление переменных окружения со значениями по умолчанию
const {
  PORT = 3000,
  MESTO_DB_CONNECT = 'mongodb://127.0.0.1:27017/mestodb',
} = process.env;

// Подключение express
const app = express();

// Коннект БД по значению переменной окружения
mongoose.connect(MESTO_DB_CONNECT);

// Парсинг кук
app.use(cookieParser());

app.use(express.json()); /* Более актуальный способ парсинга */
app.use(express.urlencoded({ extended: true }));

// Путь к папке public
app.use(express.static(path.join(__dirname, 'public')));

// Направление по всем рабочим рутам
app.use(routes);
// Обработка любого несуществующего рута
app.use('*', (req, res, next) => next(new NotFound(STATUS.NOT_FOUND)));

// Обработчик ошибок celebrate
app.use(errors());

// Централизованный обработчик ошибок
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
});

// Сигнал о прослушке порта
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
