// [LOAD PACKAGES]
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var moment = require('moment');

//[Schema Setting]
var userSchema = require('./models/userSchema');
var privateCalSchema = require('./models/privateCalSchema');
var publicCalSchema = require('./models/publicCalSchema');
var groupSchema = require('./models/groupSchema');

// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// [CONFIGURE SERVER PORT]
var port = process.env.PORT || 8080;

// [CONFIGURE ROUTER]
var router = require('./route')(app, moment, userSchema, privateCalSchema, publicCalSchema, groupSchema);

// [RUN SERVER]
var server = app.listen(port, function () {
    console.log("Express server has started on port " + port)
});

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function () {
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

mongoose.connect('mongodb://localhost/test');