var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var realtime = require('./realtime');

var NodeSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  address: {type: String, required: true},
  offline: {type: Boolean, required: false}
});
var Node = mongoose.model('Node', NodeSchema);

var NotificationSchema = new Schema({
  title: {type: String, required: true },
  body: { type: String, required: false },
  icon: { type: String, required: false},
  data: {type: String, required: false},

  source: {type: String, required: false}

},{
  timestamps: {createdAt:'timestamp'}
});
NotificationSchema.post('save', function(doc) {
  realtime.sendNotification(doc);
});
var Notification = mongoose.model('Notification', NotificationSchema);

module.exports = {
  Node:Node,
  Notification:Notification,
  all: [Node,Notification]
};
