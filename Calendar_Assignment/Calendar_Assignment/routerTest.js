//server.js 내용 가져옴 

// [LOAD PACKAGES]
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// [CONFIGURE SERVER PORT]
var port = process.env.PORT || 8585;

// [CONFIGURE ROUTER]
var router = require('./router')(app);

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

/*
 * 아래부터 테스트 코드
 */
var request = require("supertest");
//var should = require("should");

// This agent refers to PORT where program is runninng.

// UNIT test begin

describe("SAMPLE unit test",function(){

  // #1 should return home page

  it("should return home page",function(done){
      // calling home page api
      request(app)
          .get("/calendar")
        //.expect("Content-type",/json/)
        //.expect(200) // THis is HTTP response
        .end(function (err, res) {
            console.log(res.text);
            done();
         });
  });

});