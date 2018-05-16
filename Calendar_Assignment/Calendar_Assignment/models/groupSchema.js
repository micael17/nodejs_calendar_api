var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var groupSchema = new Schema({
	group_name: String,
	user_db_id: String 
});

module.exports = mongoose.model('calGroup', groupSchema, 'calGroup');