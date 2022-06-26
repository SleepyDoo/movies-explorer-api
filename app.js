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
const { login, createUser } = require('./controllers/users');
const { loginVal, createUserVal } = require('./middlewares/validation');

const app = express();

const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/diplomadb', (err) => {
  if (err) {
    throw err;
  }
  console.log('connected to MongoDB');
});

const corsOptions = {
  credentials: true,
  origin: ['https://sleepydoo.diploma.nomoredomains.xyz',
    'http://sleepydoo.diploma.nomoredomains.xyz',
    'https://localhost:3000',
    'http://localhost:3000',
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

app.post('/signin', loginVal, login);
app.post('/signup', createUserVal, createUser);

app.use('/', auth, require('./routes/users'));
app.use('/', auth, require('./routes/movies'));

app.use((req, res, next) => {
  next(new NotFoundErr('Не найдено'));
}, auth);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Ссылка на сервер:');
  console.log('http://localhost:3000');
});
