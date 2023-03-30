const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate'); /* Если запрос не проходит валидацию, celebrate передаст его в этот мидлвэр */
const cookieParser = require('cookie-parser');
const { MESTO_DB_CONNECT, PORT } = require('./config');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

// Подключение express
const app = express();

// Коннект БД по значению переменной окружения
mongoose.connect(MESTO_DB_CONNECT);

app.use(limiter);

// Автоматическая простановка заголовков безопасности
app.use(helmet());

// Парсинг кук
app.use(cookieParser());

app.use(express.json()); /* Более актуальный способ парсинга */
app.use(express.urlencoded({ extended: true }));

// Направление по всем рутам
app.use(routes);

// Обработчик ошибок celebrate
app.use(errors());

// Централизованный обработчик ошибок
app.use(errorHandler);

// Сигнал о прослушке порта
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
