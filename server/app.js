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
  locations: locations.finland.join(',')
  //track: 'skate,skeitti'
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
    db.createCollection('tweets', { capped: true, size: 1*1024*1024 }, function(err, ret) {
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
  // Register routes
  function(done) {
    require('./routes').init(app, db, collection);
    done();
  },
  // Listen to tweets
  function(done) {
    var stream = T.stream('statuses/filter', filter);
    var n = 0;
    stream.on('tweet', function(tweet) {
      var text = tweet.text.toLowerCase();
      if (text.indexOf('skate') == -1 &&
          text.indexOf('skeitti') == -1 &&
          text.indexOf('skeittaamaan') == -1) {
        return;
      }
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
