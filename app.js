var mongoose = require('mongoose');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var api = require('./routes/api');

var tasks = require('./js/tasks');

mongoose.connect('mongodb://localhost/automation');

var app = express();

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';


// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/', api);

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      title: 'error'
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    title: 'error'
  });
});

var runTasks = function (tasks,delay) {
  setTimeout(runTasks,delay,tasks,delay);
  var now = new Date();
  tasks.forEach(function (task) {
    var start = Date.now();
    var env = {
      now: now,
      lastRun: task.lastRun||'NEVER'
    };
    if (task.enabled&&task.shouldRun(env)) {
      task.run(env);
      var end = Date.now();
      console.log('Ran task \'' + task.name + '\' at ' + now + ' in ' + (end-start) +  ' milliseconds.');
      task.lastRun = now;
    }
  });
};
runTasks(tasks.tasks,tasks.delay);

module.exports = app;
