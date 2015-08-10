/**
 * Created by jakebillings on 8/6/15.
 */
var util = require('./util');
var models = require('./models');

var tasks = [];

tasks.push({
  name: 'Turn on Lights in Jake\'s Room in morning',
  enabled: true,
  shouldRun: util.time('TEST'),
  run: util.state('Jake\'s Node (fake)',2,'on',console.log)
});

module.exports = tasks;
