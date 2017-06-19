var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var publicCalSchema = new Schema({
    group_id: String,
    year: Number,
    month: Number,
    day: Number,
    start_time: Date,
    end_time: Date,
    schedule: String,
    
    user_db_id: String,
    isShow : Boolean
});

module.exports = mongoose.model('publicCal', publicCalSchema, 'publicCal');