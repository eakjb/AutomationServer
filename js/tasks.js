var request = require('request');

var models = require('./models');
var Node = models.Node;
var Notification = models.Notification;

var localTasks = require('./tasks.local');

var util = require('./util');

var tasks = [
  {
    name: 'Validate Nodes',
    enabled: true,
    shouldRun: util.delay(30000),
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
                console.log('Marking invalid node: \'' + datum.name + '\'.');

                datum.offline = true;
              } else {
                console.log('\'' + datum.name + '\' is valid.');

                datum.offline = false;
              }

              datum.save(function (e) {
                console.log(e);
              });
            });
          }

        });
      });
    }
  },
  {
    name: 'Remove Old Notifications',
    enabled: true,
    shouldRun: util.delay(3600),//0000),
    run: function (env) {
      var old = new Date();
      old.setHours(old.getHours()-24);
      Notification.remove({timestamp: {$lt:old}}, function(err, result) {
        if (err) {
          console.log(err);
        }
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
