require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { errors } = require('celebrate');

const { errorHandler } = require('./errors/errorHandler');
const NotFoundErr = require('./errors/notFoundErr');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { auth } = require('./middlewares/auth');

const app = express();

const PORT = 3000;

let DB_URL;

if (process.env.NODE_ENV !== 'production') {
  DB_URL = 'DB_URL=mongodb://localhost:27017/mydb';
} else {
  DB_URL = process.env.DB_URL;
}

mongoose.connect(DB_URL, () => {
  console.log('connected to MongoDB');
});

const corsOptions = {
  credentials: true,
  origin: ['https://sleepydoo.diploma.nomoredomains.xyz',
    'http://sleepydoo.diploma.nomoredomains.xyz',
    'https://localhost:3000',
    'http://localhost:3000',
    'http://localhost:3001',
    'https://localhost:3001',
  ],
  optionsSuccessStatus: 200,
  method: ['GET, HEAD, PUT, PATCH, POST, DELETE'],
  preflightContinue: false,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);

app.use(require('./routes/authorization'));

app.use(auth);

app.use(require('./routes/users'));
app.use(require('./routes/movies'));

app.use((req, res, next) => {
  next(new NotFoundErr('Не найдено'));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Ссылка на сервер:');
  console.log('http://localhost:3000');
});
