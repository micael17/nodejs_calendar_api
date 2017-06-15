var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var groupSchema = new Schema({
	Name: String,
	groupNum: Number
});

module.exports = mongoose.model('group', groupSchema, 'group');