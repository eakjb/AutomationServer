var express = require('express');
var router = express.Router();
var models = require('../js/models');
var restify = require('express-restify-mongoose');

var app = express();

models.all.forEach(function (model) {
  restify.serve(router, model, {
    onError: function (err, req, res, next) {
      console.log(err);
      console.log(req.body);
    }
  });
});

module.exports = router;
