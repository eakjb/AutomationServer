/**
 * Created by jakebillings on 8/6/15.
 */
var models = require('./models');
var Node = models.Node;

var request = require('request');

module.exports.delay = function (length, and) {
  return function (env) {
    var andRes = true;
    if (and) andRes = and(env);
    if (env.lastRun === 'NEVER') return andRes;
    return andRes && (env.now.getTime() > env.lastRun.getTime() + length);
  }
};

module.exports.WEEK_DAYS = [1,2,3,4,5];
module.exports.WEEKENDS = [0,6];
module.exports.FULL_WEEK = [0,1,2,3,4,5,6];
module.exports.SCHOOL_DAYS = [0,1,2,3,4];

module.exports.time = function (time, and) {
  if (time === 'TEST') {
    var now = new Date();
    time = {};
    time.hour = now.getHours();
    time.minute = now.getMinutes();
    time.second = now.getSeconds() + 1;
    time.daysOfWeek = module.exports.FULL_WEEK;
  }
  //console.log('Running task at ' + hour + ':' + minute + ':' + second);
  return function (env) {
    if ((and && and(env)) || !and) {
      return (env.lastRun === 'NEVER' ||
      (env.now.getTime() > env.lastRun.getTime() + 1000)) &&
        env.now.getHours() === time.hour &&
        env.now.getMinutes() === time.minute &&
        env.now.getSeconds() === time.second &&
        (time.daysOfWeek.indexOf(env.now.getDay()) >= 0);
    }
    return false;
  };
};

module.exports.state = function (nodeName, output_id, state, onError) {
  return function (env) {
    Node.find().where('name').equals(nodeName).exec(function (error, data) {
      if (error && onError) {
        onError(error);
      }
      if (data) {
        var datum = data[0];

        if (datum) {
          request(datum.address + '/outputs', function (error, response, body) {
            if (error && onError) {
              onError(error);
            }

            var outputs = JSON.parse(body);
            if (outputs.isWrapped&&outputs.data) {
              outputs=outputs.data
            }

            outputs.forEach(function (output) {
              if (output.output_id === output_id) {
                var addr = datum.address + '/outputs/' + output_id + '/state';
                var payload = {
                  value: output.states[state].value
                };

                console.log('PUT', addr, payload);

                request.put({
                  url: addr,
                  body: payload,
                  json: true,
                  method: 'put'
                }, function (error, response, body) {

                  if (error && onError) {
                    onError(error);
                  }

                  console.log(response.statusCode);

                });


              }
            });

          });
        }
      }
    });
  };
};
