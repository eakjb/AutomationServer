var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NodeSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  address: {type: String, required: true},
  offline: {type: Boolean, required: false}
});
var Node = mongoose.model('Node', NodeSchema);

module.exports = {
  Node:Node,
  all: [Node]
};
