const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// app.enable('trust proxy');
// app.all("*", (req, res, next) => {
//   if (req.secure) {
//     // request was via https, so do no special handling
//     next();
//   } else {
//     let host = req.headers.host;
//     host = host.replace(/\:\d+$/, ''); // Remove port number
//     res.redirect(307, `https://${host}${req.path}`);
//   }
// });

app.use((req, res, next) => {
  if (req.secure) {
    // request was via https, so do no special handling
    next();
  } else {
    let host = req.headers.host;
    host = host.replace(/\:\d+$/, ''); // Remove port number
    res.redirect(307, `https://${host}${req.path}`);
  }
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
