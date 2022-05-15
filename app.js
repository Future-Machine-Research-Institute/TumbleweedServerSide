var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// app.enable('trust proxy');
app.all("*", (req, res, next) => {
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
