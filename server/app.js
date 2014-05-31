var async = require('async');
var twit = require('twit');
var express = require('express');
var http = require('http');
var MongoClient = require('mongodb').MongoClient;
var app = express();

var config = require('../config.json');

var Twit = require('twit');
var T = new Twit(config.twitter);


var locations = {
  helsinki: [ 24.831249, 60.130150, 25.202221, 60.289291 ],
  finland: [ 20.548571, 59.764881, 31.586201, 70.092308 ],
  nyc: [-74,40,-73,41]
}
var filter = {
  //locations: locations.nyc
  locations: locations.finland,
  track: 'skate,skeitti'
};

var db;
var collection;
var server;

async.series([
  // Connect to mongo
  function(done) {
    MongoClient.connect('mongodb://127.0.0.1:27017/twitter-stream', function(err, ret) {
      db = ret;
      done(err);
    });
  },
  // Create target collection
  function(done) {
    db.createCollection('tweets', { capped: true, size: 100 }, function(err, ret) {
      collection = ret;
      done(err);
    });
  },
  // Create server
  function(done) {
    server = http.createServer(app).listen(4000, function() {
      console.log('Express server listening on port 4000');
      done();
    });
  },
  // Listen to tweets
  function(done) {
    var stream = T.stream('statuses/filter', filter);
    var n = 0;
    stream.on('tweet', function(tweet) {
      n++;
      console.log('insert '+n);
      collection.insert(tweet, function(err, data) {
        if (err) done(err);
      });
    });
  }

  ], function(err) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
