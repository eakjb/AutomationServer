var request = require('request');

var models = require('./models');
var Node = models.Node;

var localTasks = require('./tasks.local');

var util = require('./util');

var tasks = [
  {
    name: 'Validate Nodes',
    enabled: true,
    shouldRun: util.delay(10000),
    run: function (env) {
      Node.find(function (error, data) {
        if (error) console.log(error);

        var addresses = [];

        data.forEach(function (datum) {
          if (addresses.indexOf(datum.address)>-1) {
            datum.remove();
            console.log('Removing duplicate node: \'' + datum.name + '\'.');
          } else {
            addresses.push(datum.address);

            request(datum.address, function (error,response,body) {
              if (error) {
                console.log(error);
                console.log('Removing invalid node: \'' + datum.name + '\'.');

                datum.remove();
              } else {
                console.log('\'' + datum.name + '\' is valid.');
              }
            });
          }

        });
      });
    }
  }
];

localTasks.forEach(function (task) {
  tasks.push(task);
});

module.exports = {
  tasks:tasks,
  local:localTasks,
  delay: 500
};
