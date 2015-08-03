var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NodeSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  address: {type: String, required: true}
});
var Node = mongoose.model('Node', NodeSchema);

module.exports = {
  Node:Node,
  all: [Node]
};
