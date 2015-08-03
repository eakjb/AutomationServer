var request = require('request');

var models = require('./models');
var Node = models.Node;

function delay(length) {
  return function (env) {
    if (env.lastRun==='NEVER') return true;
    return env.now.getTime() > env.lastRun.getTime() + length;
  }
}

var tasks = [
  {
    name: 'Validate Nodes',
    enabled: true,
    shouldRun: delay(5000),
    run: function (env) {
      Node.find(function (error, data) {
        if (error) console.log(error);

        data.forEach(function (datum) {

          request(datum.address, function (error,response,body) {
            if (error) {
              console.log(error);
              console.log('Removing invalid node: \'' + datum.name + '\'.');

              datum.remove();
            } else {
              console.log('\'' + datum.name + '\' is valid.');
            }
          });

        });
      });
    }
  }
];

module.exports = {
  tasks:tasks,
  delay: 1000
};
