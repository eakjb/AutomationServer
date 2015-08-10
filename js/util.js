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

module.exports.time = function (hour, minute, second, and) {
  if (hour === 'TEST') {
    var now = new Date();
    hour = now.getHours();
    minute = now.getMinutes();
    second = now.getSeconds() + 1;
  }
  console.log('Running task at ' + hour + ':' + minute + ':' + second);
  return function (env) {
    if ((and && and(env)) || !and) {
      return (env.lastRun === 'NEVER' ||
        env.now.getTime() > env.lastRun.getTime() + 1000) &&
        env.now.getHours() === hour &&
        env.now.getMinutes() === minute &&
        env.now.getSeconds() === second;
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

        console.log(data);

        request(datum.address + '/outputs', function (error, response, body) {
          if (error && onError) {
            onError(error);
          }

          var outputs = JSON.parse(body).data;

          console.log(outputs);

          outputs.forEach(function (output) {
            if (output.output_id === output_id) {
              var addr = datum.address + '/outputs/' + output_id + '/state';
              var payload = {
                value: output.states[state].value
              };

              console.log('PUT', addr, payload);

              request({
                url: addr,
                body:JSON.stringify(payload),
                method: 'PUT'

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
    });
  };
};
