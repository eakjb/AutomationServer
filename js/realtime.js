var _io;
module.exports = {
  init:function (io) {
    _io=io;
  },
  sendNotification: function (notification) {
    _io.emit('notification', notification);
  }
};
