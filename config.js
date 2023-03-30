// Подключение библиотеки для чтения переменных окружения из .env
require('dotenv').config();

// Объявление переменных окружения со значениями по умолчанию
const { PORT = 3000 } = process.env;
const { MESTO_DB_CONNECT = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const { JWT_SECRET = 'secret-key' } = process.env;

module.exports = {
  PORT,
  MESTO_DB_CONNECT,
  JWT_SECRET,
};
