/**
 * Created by jakebillings on 8/6/15.
 */
var util = require('./util');
var models = require('./models');

var tasks = [];

tasks.push({
  name: 'Turn on Lights in Jake\'s Room in morning',
  enabled: true,
  shouldRun: util.time({
    hour:6,
    minute: 30,
    second: 0,
    daysOfWeek:util.WEEK_DAYS
  }),
  run: util.state('JakeRoom',2,'on',console.log)
});

tasks.push({
  name: 'Turn off Lights in Jake\'s Room in morning',
  enabled: true,
  shouldRun: util.time({
    hour:7,
    minute: 5,
    second: 0,
    daysOfWeek:util.FULL_WEEK
    }),
  run: util.state('JakeRoom',2,'off',console.log)
});

tasks.push({
  name: 'Turn off Lights in Jake\'s Room in morning in case he forgot something',
  enabled: true,
  shouldRun: util.time({
    hour:8,
    minute: 0,
    second: 0,
    daysOfWeek:util.FULL_WEEK
  }),
  run: util.state('JakeRoom',2,'off',console.log)
});

tasks.push({
  name: 'Turn on Lights in Jake\'s Room on School Evenings',
  enabled: true,
  shouldRun: util.time({
    hour:19,
    minute: 30,
    second: 0,
    daysOfWeek:util.SCHOOL_DAYS
  }),
  run: util.state('JakeRoom',2,'on',console.log)
});

tasks.push({
  name: 'Turn off Lights in Jake\'s Room at Night (warning off)',
  enabled: true,
  shouldRun: util.time({
    hour:21,
    minute: 55,
    second: 0,
    daysOfWeek:util.FULL_WEEK
  }),
  run: util.state('JakeRoom',2,'off',console.log)
});

tasks.push({
  name: 'Turn off Lights in Jake\'s Room at Night (on)',
  enabled: true,
  shouldRun: util.time({
    hour:21,
    minute: 55,
    second: 20,
    daysOfWeek:util.FULL_WEEK
  }),
  run: util.state('JakeRoom',2,'on',console.log)
});

tasks.push({
  name: 'Turn off Lights in Jake\'s Room at Night',
  enabled: true,
  shouldRun: util.time({
    hour:22,
    minute: 0,
    second: 0,
    daysOfWeek:util.FULL_WEEK
  }),
  run: util.state('JakeRoom',2,'off',console.log)
});

tasks.push({
  name: 'Turn on Christmas Tree in Morning on School Days',
  enabled: true,
  shouldRun: util.time({
    hour: 5,
    minute: 0,
    second: 0,
    daysOfWeek:util.WEEK_DAYS
  }),
  run: util.state('Living Room',0,'on',console.log)
});

tasks.push({
  name: 'Turn on Christmas Tree in Morning on Weekends',
  enabled: true,
  shouldRun: util.time({
    hour: 7,
    minute: 30,
    second: 0,
    daysOfWeek:util.WEEKENDS
  }),
  run: util.state('Living Room',0,'on',console.log)
});

tasks.push({
  name: 'Turn off Christmas Tree in Morning on School Days',
  enabled: true,
  shouldRun: util.time({
    hour: 6,
    minute: 30,
    second: 0,
    daysOfWeek:util.WEEK_DAYS
  }),
  run: util.state('Living Room',0,'off',console.log)
});

tasks.push({
  name: 'Turn on Christmas Tree in Morning on School Days for Jake',
  enabled: true,
  shouldRun: util.time({
    hour: 6,
    minute: 58,
    second: 0,
    daysOfWeek:util.WEEK_DAYS
  }),
  run: util.state('Living Room',0,'on',console.log)
});

tasks.push({
  name: 'Turn off Christmas Tree in Morning on School Days for Jake',
  enabled: true,
  shouldRun: util.time({
    hour: 7,
    minute: 30,
    second: 0,
    daysOfWeek:util.WEEK_DAYS
  }),
  run: util.state('Living Room',0,'off',console.log)
});

tasks.push({
  name: 'Turn on Christmas Tree in Afternoon on School Days',
  enabled: true,
  shouldRun: util.time({
    hour: 5,
    minute: 0,
    second: 0,
    daysOfWeek:util.WEEK_DAYS
  }),
  run: util.state('Living Room',0,'on',console.log)
});

tasks.push({
  name: 'Turn off Christmas Tree at night',
  enabled: true,
  shouldRun: util.delay(1000), //util.time({
  //  hour: 21,
  //  minute: 30,
  //  second: 0,
  //  daysOfWeek:util.FULL_WEEK
  //}),
  run: util.state('Living Room',0,'off',console.log)
});

module.exports = tasks;
