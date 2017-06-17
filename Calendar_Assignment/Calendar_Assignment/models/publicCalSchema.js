var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var publicCalSchema = new Schema({
    date: Date,
    start_time: Date,
    end_time: Date,
    schedule: String,
    groupNum: Number    
});

module.exports = mongoose.model('publicCal', publicCalSchema, 'publicCal');