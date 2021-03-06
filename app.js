const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const { successCode, failureCode, dataNotLegal, requestSucceeded } = require("./routes/routes_config")

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const packageRouter = require('./routes/package')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

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

app.use('/avatar', express.static(path.join(__dirname, './resource/avatar')));
app.use('/app', express.static(path.join(__dirname, './resource/app')));

app.use((req, res, next) => {
  if (req.secure) {
    // request was via https, so do no special handling
    next()
  } else {
    let host = req.headers.host
    host = host.replace(/\:\d+$/, '') // Remove port number
    res.redirect(307, `https://${host}${req.path}`)
  }
});

app.use(express.static(path.join(__dirname, 'public')))

app.use(indexRouter)
app.use(usersRouter)
app.use(packageRouter)

app.use((req, res, next) => {
  res.status(404).send('404 Not Found')
});

app.use((err, req, res, next) => {
  res.status(500).json({
    ret: failureCode,
    message: err.message
  })
})

module.exports = app
