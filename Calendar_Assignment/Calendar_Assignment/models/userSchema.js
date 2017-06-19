var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	id: String,
	pw: String,
	group_id: [String],
	cal_id: String
});

module.exports = mongoose.model('user', userSchema, 'user');