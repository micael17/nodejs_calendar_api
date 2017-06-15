var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	Name: String,
	Pw: String,
	groupNum: Number
});

module.exports = mongoose.model('user', userSchema, 'user');