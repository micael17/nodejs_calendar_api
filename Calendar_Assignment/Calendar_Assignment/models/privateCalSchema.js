var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var privateCalSchema = new Schema({
    date: Date,
    start_time: Date,
    end_time: Date,
    schedule: String,
    user_idx: Number,
    isBirthday: Boolean
});

module.exports = mongoose.model('privateCal', privateCalSchema, 'privateCal');