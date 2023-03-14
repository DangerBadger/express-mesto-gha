const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');
const STATUS = require('./utils/constants/status');
const { NOT_FOUND_CODE } = require('./utils/constants/status-code');

// Подключение библиотеки для чтения переменных окружения из .env
require('dotenv').config();

const { PORT = 3000 } = process.env;
const { MESTO_DB_CONNECT = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MESTO_DB_CONNECT); // Тест ругается на отсутсвие URI

app.use((req, res, next) => {
  req.user = {
    _id: '640db84618492dd7ea9dc506',
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req, res) => res.status(NOT_FOUND_CODE).send({ message: STATUS.NOT_FOUND }));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

// 640db84618492dd7ea9dc506 id
