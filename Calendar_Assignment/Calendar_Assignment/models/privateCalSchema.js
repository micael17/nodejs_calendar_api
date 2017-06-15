var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var privateCalSchema = new Schema({
    date: Date,
    schedule: String,
    isBirthday: Boolean
});

module.exports = mongoose.model('privateCal', privateCalSchema, 'privateCal');