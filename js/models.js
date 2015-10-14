var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var realtime = require('./realtime');

//Node
var NodeSchema = new Schema({
  name: { type: String, required: true, unique:true, dropDups:true },
  description: { type: String, required: false },
  address: {type: String, required: true, unique:true, dropDups:true },
  offline: {type: Boolean, required: false}
});
var Node = mongoose.model('Node', NodeSchema);

//Recipient
var validateEmail = function(email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
};
var RecipientSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: false, validate: [validateEmail, 'Please fill a valid email address'] },
  minPriority: { type: Number, default: 100 }
});
var Recipient = mongoose.model('Recipient', RecipientSchema);

//Notification
var NotificationSchema = new Schema({
  title: {type: String, required: true },
  body: { type: String, required: false },
  icon: { type: String, required: false},
  data: {type: String, required: false},

  source: {type: String, required: false},
  priority: {type: Number, default: 100 }
},{
  timestamps: {createdAt:'timestamp'}
});
NotificationSchema.post('save', function(doc) {
  Recipient.find({},function (error, result) {
    if (error) {
      console.log(error);
    }
    realtime.sendNotification(doc,result);
  });
});
var Notification = mongoose.model('Notification', NotificationSchema);

module.exports = {
  Node:Node,
  Notification:Notification,
  Recipient:Recipient,
  all: [Node,Notification,Recipient]
};
