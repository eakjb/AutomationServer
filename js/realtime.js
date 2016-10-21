var _io;

var nodemailer = require('nodemailer');
var moment = require('moment');

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'eakjb.auto@gmail.com',
    pass: 'ILoveGoogle'
  }
});

var sendNotification = function (notification,recipients) {
  _io.emit('notification', notification);
  recipients.forEach(function (recipient) {
    console.log(recipient);

    if (recipient.minPriority<=notification.priority) {
      if (recipient.email) {
        transporter.sendMail({

          to: recipient.email,
          from: "Eakjb Auto <eakjb.auto@gmail.com>",
          subject: moment(notification.timestamp).format('MMM-DD-YYYY hh:mm A'),
          text: notification.title + ': ' + (notification.body||'[No Content]'),
          html: notification.title + ': ' + (notification.body||'[No Content]')

        }, function (error, info) {
          if (error) {
            return console.log(error);
          }
          console.log('Message sent: ' + info.response);

        });
      }
    }

  });
};

module.exports = {
  init:function (io) {
    _io=io;

    _io.on('connection', function (socket) {
      socket.on('notification', function (notification) {
        var models = require('./models');
        models.Recipient.find({},function (error, result) {
          if (error) {
            console.log(error);
            socket.emit('error', error);
          }
          sendNotification(notification,result);
        });
      });
    });
  },
  sendNotification: sendNotification
};
