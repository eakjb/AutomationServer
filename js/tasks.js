var request = require('request');
var cheerio = require('cheerio');

var models = require('./models');
var Node = models.Node;
var Notification = models.Notification;
var Recipient = models.Recipient;

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
    shouldRun: util.delay(36000000),
    run: function (env) {
      var old = new Date();
      old.setHours(old.getHours()-24);
      Notification.remove({timestamp: {$lt:old}}, function(err, result) {
        if (err) {
          console.log(err);
        }
      });
    }
  },
  {
    name: 'Check For Snowday',
    enabled: true,
    shouldRun: util.delay(300000),
    run: function (env) {
      var schools = ['American Academy Castle Pines','STEM School and Academy'];
      request("https://dcsdk12.org/school-closure-status", function (error,response,body) {
        if (error) {
          console.log('error loading snowday data');
          console.log(error);
        } else {
          console.log('body loaded');
          var $ = cheerio.load(body);
          $('.views-row').each(function (i,row) {
            var schoolName = $(this,'a').text().replace('Closure','').trim();
            //console.log(schoolName);
            schools.forEach(function (schoolName1) {
              if (schoolName.indexOf(schoolName1)>-1) {
                if($(row).html().indexOf('activities-regular')>-1) {
                  console.log(schoolName+' has school.')
                } else {
                  console.log(schoolName+' has no school!!! Sending Notification!');

                  var start = new Date();
                  start.setHours(0,0,0,0);
                  var end = new Date();
                  end.setHours(24,0,0,0);

                  Notification.find({
                    body: 'Could it be a snowday?',
                    "timestamp": {"$gte": start, "$lt": end}
                  }, function (error, result) {
                    if (error) {
                      console.log(error);
                    }

                    if (!result||result.length<=0) {
                      var notification = new Notification({
                        title: schoolName + ' has a modified schedule',
                        body: 'Could it be a snowday?',
                        priority: 10000
                      });

                      notification.save(function (error) {
                        if (error) {
                          console.log('error saving snowday notification');
                          console.log('error');
                        }
                      });
                    }
                  });
                }
              }
            });
          });
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
  delay: 1000
};
