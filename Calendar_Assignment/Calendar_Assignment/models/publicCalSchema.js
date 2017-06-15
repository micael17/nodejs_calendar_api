var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var publicCalSchema = new Schema({
    date: Date,
    schedule: String,
    groupNum: Number    
});

module.exports = mongoose.model('publicCal', publicCalSchema, 'publicCal');